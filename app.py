from flask import Flask, render_template, request, redirect, send_file
import shutil
import psutil
import socket
import platform
from pathlib import Path
from flask_socketio import SocketIO, emit
import os
from server import McServer, generate_tree
import json

#####https://mctools.readthedocs.io/en/master/rcon.html

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, async_mode=async_mode)

minecraft_server = McServer(name="server1", host='10.1.1.101')
minecraft_server2 = McServer(name="server2", host='10.1.1.102')

servers : dict[str, McServer] = {"1":minecraft_server, "2":minecraft_server2}

@app.route('/server/<id>/stop', methods=['POST'])
def stop(id):
    if not id in servers:
        return "Server not found"
    server : McServer = servers[id]
    server.send_rcon_command("stop")
    return redirect('/server/' + id)

@app.route('/', methods=['GET', 'POST'])
def index():
    for id, server in servers.items():
        server.check_alive()
    cpu_percent = psutil.cpu_percent()
    cpu_count = psutil.cpu_count()
    ram = psutil.virtual_memory()
    hostname = socket.gethostname()
    SO = platform.uname().system + " " +  " " + platform.uname().release
    cpu_type = platform.uname().processor
    server_data = {"cpu":cpu_percent, "cpu_count":cpu_count, "ram":ram, "hostname":hostname, "SO":SO, "cpu_type":cpu_type}
        
    return render_template('index.html', servers=servers, data=server_data)

@app.route('/server/<id>', methods=['GET', 'POST'])
def server(id):
    if not id in servers:
        return "Server not found"
    server : McServer = servers[id]
    server.check_alive()

    print("is_on(ping):", server.is_server_on)
    return render_template('console.html',server=server, servers=servers, id=id)

@app.route('/server/<id>/files', methods=['GET', 'POST'])
def files(id):
    #check method
    if request.method == 'POST':
        server : McServer = servers[id]
        server.check_alive()
        if server.is_server_on:
            server.send_rcon_command(request.form['command']) 
    elif request.method == 'GET':
        if not id in servers:
            return "Server not found"
        server : McServer = servers[id]
        server.check_alive()

        files = generate_tree(server.PATH, server.PATH.split("/")[-1])

        print("is_on(ping):", server.is_server_on)
        return render_template('files.html',server=server, servers=servers, id=id, files=files)

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
        file = request.args.get('q')
        if not server.PATH in file:
            return redirect('/server/' + id + '/files')
        with open(file, "r") as editor:
            file_content = editor.readlines()
            file_content = "\n".join(file_content)
        return render_template('file_editor.html', server=server, servers=servers, id=id, content=file_content, path=file)
    return ""

@app.route('/server/<id>/download')
def download(id):
    server : McServer = servers[id]
    file : str = request.args.get('q')

    if Path(file).is_dir():
        #create tmp zip in /tmp and delete after
        shutil.make_archive("/tmp/tmp", 'zip', file)
        return send_file("/tmp/tmp.zip", as_attachment=True)
    return send_file(file, as_attachment=True)


@app.route('/server/<id>/config', methods=['GET', 'POST'])
def config(id):
    servers[id].check_alive()
    server : McServer = servers[id]
    if request.method == 'POST':
        server.update_properties(dict(request.form))
    if not id in servers:
        return "Server not found"
    with open("data/server_properties.json", "r") as file:
        server_config : dict = json.load(file)

    a : dict = server.config
    b = {}
    for key, value in a.items():
        if key in server_config:
            b[key] = value
    print("is_on(ping):", server.is_server_on)
    return render_template('config.html',server=server, servers=servers, id=id, config=b)

@socketio.on('send_command')  # Define a WebSocket event called 'send_command'
def handle_send_command(data):
    print(request.path)
    content = data["command"]
    serverid = data["serverid"].split("/")[-1]
    server = servers[serverid]
    print(content)
    if server.is_server_on:
        content = server.send_rcon_command(content).replace("[0m", "")
        if content != '':
            emit('recv', server.send_content(other_content=content))


@socketio.event
def update(data:dict[str,str]):
    serverid = data["serverid"].split("/")[-1]
    if serverid  in servers:
        content = servers[serverid].send_content()
        emit('recv', content)



if __name__ == '__main__':
    # Configuración del servidor Minecraft
    host = os.getenv("HOST_MC")
    
    app.run(debug=True, port=12344 , host='0.0.0.0')
