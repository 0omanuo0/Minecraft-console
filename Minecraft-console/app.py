from flask import Flask, render_template, request, redirect, send_file, jsonify
import shutil
from pathlib import Path
from flask_socketio import SocketIO, emit
import os
from python.server import McServer
from python.tools import get_host_status, generate_tree
import json
import subprocess
import uuid

#####https://mctools.readthedocs.io/en/master/rcon.html

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode, cors_allowed_origins="http://localhost:3000")

servers_path = "/home/manu/mc_servers/"

minecraft_server =  McServer(name="server1", id=str(uuid.uuid4()), host='10.1.1.101', path="data/default_server"  )
minecraft_server2 = McServer(name="truquito",id=str(uuid.uuid4()), host='10.1.1.102', path=servers_path+"truquito")

servers : dict[str, McServer] = {
                                  minecraft_server2.id: minecraft_server2,
                                  minecraft_server.id: minecraft_server
                                }

servers_process : dict[str, subprocess.Popen] = {}

def notFound():
    data = {"status":"NotFound"}
    return jsonify(data)


@app.route('/servers')
def servers_list():
    data = {"servers":[
        server.json() for server in servers.values()
    ]}
    return jsonify(data)


@app.route('/server/<id>/stop', methods=['POST'])
def stop(id):
    if not id in servers:
        return notFound()
    
    server : McServer = servers[id]
    server.send_rcon_command("stop")
    
    return redirect('/server/' + id)

@app.route('/server/<id>/start', methods=['POST'])
def start(id):
    if not id in servers:
        return notFound()

    server : McServer = servers[id]
    #open subprocess running java -jar server.jar nogui in server.PATH and redirect stdout to log_server variable
    server_proc = subprocess.Popen(["java", "-jar", "server.jar", "nogui"], cwd=server.PATH, stdout=None)
    servers_process[id] = server_proc
    data = {"status":"Started"}
    return jsonify(data)



@app.route('/server/<id>', methods=['GET', 'POST'])
def server(id):
    if not id in servers:
       return notFound()
   
    server : McServer = servers[id]
    server.check_alive()
    return jsonify(server.json())


@app.route('/create', methods=['GET', 'POST'])
def create():
    if request.method == 'POST':
        name = request.form['name']
        host = request.form['host']
        path = request.form['path']
        if not os.path.exists(path):
            os.makedirs(path)
            #copy data/default_server content into new dir
        server = McServer(name=name, host=host, path=path)
        servers[str(len(servers)+1)] = server
        return redirect('/server/' + str(len(servers)))
    elif request.method == 'GET':
        with open("data/server_properties_create.json", "r") as file:
            server_config : dict = json.load(file)

        return render_template('create.html', config=server_config, servers=servers)



@app.route('/server/<id>/files', methods=['GET', 'POST'])
def files(id):
    #check method
    if not id in servers:
        return notFound()
    
    server : McServer = servers[id]
    server.check_alive()
    
    if request.method == 'POST':
        pass
        # if server.is_server_on:
        #     server.send_rcon_command(request.form['command']) 
    elif request.method == 'GET':
        files = generate_tree(server.PATH, server.PATH.split("/")[-1])
        return jsonify(files)


@app.route('/server/<id>/edit', methods=['GET', 'POST'])
def edit(id):
    #get query data
    server : McServer = servers[id]
    if request.method == 'POST':
        path_file = request.form['path']
        content = request.form['content']
        #replace content into file
        with open(path_file, "w") as editor:
            content = content.replace("\n\n", "\n")
            editor.write(content)
        
    elif request.method == 'GET':
        file = request.args.get('path')
        if not server.PATH in file:
            return redirect('/server/' + id + '/files')
        with open(file, "r") as editor:
            file_content = editor.readlines()
            file_content = "".join(file_content)
        content = {"content":file_content}
        return jsonify(content)
    return ""

@app.route('/server/<id>/download')
def download(id):
    server : McServer = servers[id]
    file : str = request.args.get('f')

    if Path(file).is_dir():
        #create tmp zip in /tmp and delete after
        shutil.make_archive("/tmp/tmp", 'zip', file)
        return send_file("/tmp/tmp.zip", as_attachment=True)
    return send_file(file, as_attachment=True)




@app.route('/server/<id>/config', methods=['GET', 'POST'])
def config(id):
    servers[id].check_alive()
    
    if not id in servers:
        return notFound()
    
    server : McServer = servers[id]
    
    if request.method == 'POST':
        server.update_properties(dict(request.form))

    with open("data/server_properties.json", "r") as file:
        server_config : dict = json.load(file)

    a : dict = server.config
    b = {}
    for key, value in a.items():
        if key in server_config:
            b[key] = value
    return jsonify(b)


# @app.route('/server/<id>/command', methods=['POST'])
# def command(id):
#     content = request.form['command']
#     server : McServer = servers[id]
#     server.check_alive()
#     print("Command: " + content)


@socketio.on('send_command')  # Define a WebSocket event called 'send_command'
def handle_send_command(data):
    content : str = data["command"]
    serverid : str = data["serverid"]
    server = servers[serverid]
    if server.is_server_on:
        content = server.send_rcon_command(content).replace("[0m", "")
        if content != '':
            emit('recv', server.send_content(other_content=content))




@socketio.event
def update(data:dict[str,str]):
    serverid = data["serverid"].split("/")[-1]
    if serverid in servers:
        content = servers[serverid].send_content()
        emit('recv', content)
    else:
        emit('recv', {"status":"NotFound"})



if __name__ == '__main__':
    # Configuración del servidor Minecraft
    host = os.getenv("HOST_MC")
    
    app.run(debug=True, port=12344 , host='0.0.0.0')
