import os
import requests
from lib.server import McServer
import uuid
import datetime
import json


def create_server(launch_config:dict, name:str, properties:dict, servers_path:str)->McServer:
    id = str(uuid.uuid4())
    newpath = f"{servers_path}/{id}"
    
    if not os.path.exists(newpath):
        try:
            os.makedirs(str(newpath))
            server_file = get_files(launch_config["version"])
            with open(newpath + "/server.jar", "wb") as file:
                file.write(server_file)
            with open(newpath + "/eula.txt", "w") as file:
                date = datetime.datetime.now()
                file.write("""
# By changing the setting below to TRUE you are indicating your agreement to our EULA (https://account.mojang.com/documents/minecraft_eula).
#{}
eula=true
                        """.format(date.strftime("%Y-%m-%d %H:%M:%S")))
            server = McServer(name=name, host=server.McServer.host, path=newpath, id=id)
            server.update_properties(properties)
            return server
        except Exception as e:
            # remove directory recursively
            os.rmdir(newpath)
            return e
    else:
        return Exception("Server already exists")
    

    
    
    
    
def get_files(version:str)->bytes:
    # get version from https://launchermeta.mojang.com/mc/game/version_manifest.json
    url = "https://launchermeta.mojang.com/mc/game/version_manifest.json"
    server_versions = requests.get(url).json()
    for ver in server_versions["versions"]:
        if ver["id"] == version:
            url = ver["url"]
            break
    server = requests.get(url).json()
    url_server = server["downloads"]["server"]["url"]
    
    server_file = requests.get(url_server)
    # return server_file content
    return server_file.content
    
    