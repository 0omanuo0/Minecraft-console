from flask import Flask, render_template, request, redirect, send_file, jsonify
import shutil
from pathlib import Path
from flask_socketio import SocketIO, emit
import os
from lib.server import McServer
from lib.tools import get_host_status, generate_tree
from lib.db import Database
import lib.creator
import json
import subprocess
import uuid

#####https://mctools.readthedocs.io/en/master/rcon.html

# Set this variable to "threading", "eventlet" or "gevent" to test the
# different async modes, or leave it set to None for the application to choose
# the best option based on installed packages.
async_mode = None

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(24)
socketio = SocketIO(app, async_mode=async_mode, cors_allowed_origins="http://localhost:3000")

servers_path='Minecraft-console/data'

McServer.host = 'localhost'
McServer.serversPath = servers_path

servers : dict[str, McServer] = {}

# Load servers from database
db = Database(servers_path=servers_path)
for server_data in db.get_servers():
    server = McServer(name=server_data[2], id=str(server_data[1]), host=server_data[3] if server_data[3] != "0.0.0.0" else "localhost", path=server_data[6])
    servers[server.id] = server

servers_process : dict[str, subprocess.Popen] = {}

def notFound(e : Exception = None):
    data = {"status":"NotFound", "error": str(e)}
    return jsonify(data), 404


@app.route('/servers')
def servers_list():
    a = [server.check_alive() for server in servers.values()]
    data = {"servers":[
        server.json() for server in servers.values()
    ]}
    return jsonify(data)


@app.route('/server/<id>/stop', methods=['POST'])
def stop(id):
    if not id in servers:
        return notFound()
    
    server : McServer = servers[id]

    if not servers_process.get(id) and server.is_server_on:
        # send sigkill (9) to the process
        try:
            print("Stopping server with id: ", id, server.status_server)###############################
            os.kill(server.status_server.get("PID"), 9)
            return jsonify({"status":"Server stopped"}), 200
        except Exception as e:
            print("Error stopping server: ", e)
            return jsonify({"status":"Error", "message":str(e)}), 500

    server.send_rcon_command("stop")
    
    return redirect('/server/' + id)

@app.route('/server/<id>/start', methods=['POST'])
def start(id):
    if not id in servers:
        return notFound()

    server : McServer = servers[id]
    #open subprocess running java -jar server.jar nogui in server.PATH and redirect stdout to log_server variable
    current_working_dir = os.getcwd()
    path = os.path.join(current_working_dir, server.PATH)
    #find .jar in path
    jar_files = [f for f in os.listdir(path) if f.endswith('.jar')]
    if not jar_files:
        return notFound()
    
    executable_path = os.path.join(path, jar_files[0])
    server_db = db.get_server_by_uuid(id)

    # Extract RAM and additional arguments from the database
    ram_max = str(int(server_db[7]*1024)) + "M" if server_db[7] else "1024M"
    ram_min = str(int(server_db[8]*1024)) + "M" if server_db[8] else "512M"
    auto_start = server_db[11] if server_db[11] else False
    other_args = server_db[9] if server_db[9] else ""

    java_args = [
        "java",
        f"-Xmx{ram_max}",
        f"-Xms{ram_min}",
        "-jar",
        executable_path,
        "nogui"
    ]

    # Add any additional arguments if present
    if other_args:
        java_args.extend(other_args.split())

    server_proc = subprocess.Popen(java_args, cwd=path, stdout=None, stderr=None)
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
        # get the data from aplication/json
        data = request.get_json()
        
        launch_config:dict = data["launchConfig"]
        name:str = data["serverName"]
        properties:dict = data["ConfigOpts"]
        
        server = lib.creator.create_server(launch_config, name, properties, McServer.serversPath)
        
        # insert server into database
        db.add_server(
            uuid=server.id,
            name=name,
            ip=launch_config.get("ip"),
            port=launch_config.get("port"),
            rcon_port=launch_config.get("rcon_port") or 25575,
            path=server.PATH,
            ram_max=launch_config.get("rMax"),
            ram_min=launch_config.get("rMin"),
            auto_start=launch_config.get("auto_start"),
            other_args=launch_config.get("other_args"),
            target_executable=launch_config.get("target_executable")
        )
        
        
        if isinstance(server, McServer):
            servers[server.id] = server
            return jsonify({"status":"Server created", "server":server.json()}), 200
        else:
            return jsonify({"status":"Error creating server", "error":str(server)}), 500
    else:
        return jsonify({"status":"Method not allowed"}), 405



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
    
    if not id in servers:
        return notFound()
    
    server : McServer = servers[id]
    
    if request.method == 'POST':
        import ast
        path_file = request.args.get('path')
        content = dict(request.form)["content"]
        
        #replace content into file
        with open(path_file, "w") as editor:
            # content = content.replace("\n\n", "\n")
            editor.write(content)
            # if changes the ip, update the db
            if "ip" in content:
                db.update_server(server.id, ip=content["ip"])
        return jsonify({"status":"File edited successfully"}), 200
        
    elif request.method == 'GET':
        file = request.args.get('path')
        if not server.PATH in file:
            return notFound()
        with open(file, "r") as editor:
            file_content = editor.readlines()
            file_content = "".join(file_content)
        content = {"content":file_content}
        return jsonify(content)
    return {"status":"Method not allowed"}, 405

@app.route('/server/<id>/download')
def download(id):
    server : McServer = servers[id]
    file : str = request.args.get('f')
    # define absolute path to the file joining the working directory and the file path
    working_dir = os.getcwd()
    file = os.path.join(working_dir, file)
    # check if the file exists
    if not os.path.exists(file):
        return notFound()

    if Path(file).is_dir():
        #create tmp zip in /tmp and delete after
        shutil.make_archive("/tmp/tmp", 'zip', file)
        return send_file("/tmp/tmp.zip", as_attachment=True, download_name=f"{Path(file).name}.zip")
    try:
        return send_file(file, as_attachment=True)
    except Exception as e:
        print("Error sending file: ", e)
        return notFound()
    
@app.route('/server/<id>/file/delete', methods=['DELETE']) # delete file
def delete(id):
    server : McServer = servers[id]
    if not id in servers:
        return notFound()
    
    file_path = request.args.get('f')
    if not file_path:
        return jsonify({"status":"Error", "message":"No file path provided"}), 400
    
    # check if the file is in the server path
    if not server.PATH in file_path:
        return notFound()
    
    try:
        print("Deleting file: ", file_path)###############################
        if os.path.isdir(file_path):
            shutil.rmtree(file_path)
        else:
            try:
                os.remove(file_path)
            except Exception as e:
                print("Error deleting file: ", e)
                return jsonify({"status":"Error", "message":str(e)}), 500
        return jsonify({"status":"File deleted successfully"}), 200
    except Exception as e:
        print("Error deleting file: ", e)
        return jsonify({"status":"Error", "message":str(e)}), 500
    
@app.route('/server/<id>/file/rename', methods=['POST'])
def rename(id):
    server : McServer = servers[id]
    if not id in servers:
        return notFound()
    
    file_path = request.args.get('f')
    print(request.json.get('newName'), file_path)
    new_name = request.json.get('newName')
    
    if not file_path or not new_name:
        return jsonify({"status":"Error", "message":"No file path or new name provided"}), 400
    
    # check if the file is in the server path
    if not server.PATH in file_path:
        return notFound()
    
    try:
        new_file_path = os.path.join(os.path.dirname(file_path), new_name)
        print("Renaming file from", file_path, "to", new_file_path)###############################
        if os.path.isdir(file_path):
            shutil.move(file_path, new_file_path)
        else:
            try:
                os.rename(file_path, new_file_path)
            except Exception as e:
                print("Error renaming file: ", e)
                return jsonify({"status":"Error", "message":str(e)}), 500
        return jsonify({"status":"File renamed successfully"}), 200
    except Exception as e:
        print("Error renaming file: ", e)
        return jsonify({"status":"Error", "message":str(e)}), 500
    
@app.route('/server/<id>/file/unzip', methods=['POST'])
def unzip(id):
    server : McServer = servers[id]
    if not id in servers:
        return notFound()
    
    file_path = request.args.get('f')
    if not file_path:
        return jsonify({"status":"Error", "message":"No file path provided"}), 400
    
    # check if the file is in the server path
    if not server.PATH in file_path:
        return notFound()
    
    try:
        print("Unzipping file: ", file_path)###############################
        shutil.unpack_archive(file_path, os.path.dirname(file_path))
        return jsonify({"status":"File unzipped successfully"}), 200
    except Exception as e:
        print("Error unzipping file: ", e)
        return jsonify({"status":"Error", "message":str(e)}), 500


@app.route('/server/<id>/file/<endpoint>', methods=['POST'])
def file_endpoint(id, endpoint):
    server : McServer = servers[id]
    print("Endpoint: ", endpoint)
    
    if not id in servers:
        return notFound()
    
    if endpoint == "upload":
        # handle file upload
        if 'file' not in request.files:
            return jsonify({"status":"Error", "message":"No file part"}), 400
        
        file_path = request.args.get('f')
        if not file_path:
            return jsonify({"status":"Error", "message":"No file path provided"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"status":"Error", "message":"No selected file"}), 400
        
        # save the file to the server path
        file_path = os.path.join(file_path, file.filename)
        
        if os.path.exists(file_path):
            return jsonify({"status":"Error", "message":"File already exists"}), 400
        try:
            file.save(file_path)
        except Exception as e:
            print("Error creating file: ", e)
            return jsonify({"status":"Error", "message":str(e)}), 500
        print("Saving file to: ", file_path)###############################
        return jsonify({"status":"File uploaded successfully", "file":file.filename}), 200
    
    elif endpoint == "newFolder":
        file_path = request.args.get('f')
        folder_name = request.json.get("formData").get('newName')
        if not file_path:
            return jsonify({"status":"Error", "message":"No file path provided"}), 400
        if not os.path.exists(file_path):
            return jsonify({"status":"Error", "message":"File path does not exist"}), 400
        if not request.json or 'formData' not in request.json:
            return jsonify({"status":"Error", "message":"No form data provided"}), 400
        
        print(request.json)
        if not folder_name:
            return jsonify({"status":"Error", "message":"No folder name provided"}), 400
        
        folder_path = os.path.join(file_path, folder_name)
        try:
            os.makedirs(folder_path, exist_ok=True)
        except Exception as e:
            print("Error creating folder: ", e)
            return jsonify({"status":"Error", "message":str(e)}), 500
        print("Creating folder: ", folder_path, "at: ", file_path)###############################
        return jsonify({"status":"Folder created successfully", "folder":folder_name}), 200
    
    elif endpoint == "newFile":
        file_path = request.args.get('f')
        file_name = request.json.get("formData").get('newName')
        if not file_name:
            return jsonify({"status":"Error", "message":"No file name provided"}), 400
        
        if not file_path:
            return jsonify({"status":"Error", "message":"No file path provided"}), 400
        if not os.path.exists(file_path):
            return jsonify({"status":"Error", "message":"File path does not exist"}), 400
        if not request.json or 'formData' not in request.json:
            return jsonify({"status":"Error", "message":"No form data provided"}), 400
        
        new_file_path = os.path.join(file_path, file_name)
        if os.path.exists(new_file_path):
            return jsonify({"status":"Error", "message":"File already exists"}), 400
        try:
            open(new_file_path, 'w').close()  # Create an empty file
        except Exception as e:
            print("Error creating file: ", e)
            return jsonify({"status":"Error", "message":str(e)}), 500
        print("Creating file: ", new_file_path, "at: ", file_path)
        return jsonify({"status":"File created successfully", "file":file_name}), 200
    
    else:
        return notFound()



@app.route('/server/<id>/config', methods=['GET', 'POST'])
def config(id):
    servers[id].check_alive()
    
    if not id in servers:
        return notFound()
    
    server : McServer = servers[id]
    
    if request.method == 'POST':
        print(dict(request.form))
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
    command : str = data["command"]
    serverid : str = data["serverid"]
    server = servers[serverid]
    print("Command: " + command)
    if server.check_alive():
        commandResp = server.send_rcon_command(command)
        print("Command response: ", commandResp)
        if command != '':
            emit('recv', server.send_content(other_content=[command, commandResp]))

@socketio.event
def update(data:dict[str,str]):
    serverid = data["serverid"].split("/")[-1]
    if serverid in servers:
        content = servers[serverid].send_content()
        emit('recv', content)
    else:
        emit('recv', {"status":"NotFound"})



if __name__ == '__main__':
    
    app.run(debug=True, port=12344 , host='0.0.0.0')
