from mctools import RCONClient
from lib.tools import get_process_info
import os

class McServer ():
    LIMIT_LINES = 500
    host:str = None
    serversPath:str = None
    def __init__(self, name:str, id:str, host:str=None, path:str=None) -> None:
        self.name = name
        self.id = id
        self.PATH = path if path is not None else ''
        self.config = {}
        self.rcon_password, self.rcon_port = self.get_properties()

        self.status_server = get_process_info(self.rcon_port) 

        self.host = McServer.host if host is None else host
        self.is_server_on = False

        self.content : list[str] = []
        self.check_alive()

    def update_properties(self, updated:'dict'):
        #get key and value
        convert_to_type = {"on":"true", "off":"false"}
        newconfig = {}
        for key, value in updated.items():
            if value in convert_to_type:
                value = convert_to_type[value]
            elif value.isdigit():
                value = int(value)
            if value == "true":
                self.config[key] = True
            elif value == "false":
                self.config[key] = False
            newconfig[key] = value

        lines = []
        # if dont exist the file, create it
        if not os.path.exists(self.PATH + "/server.properties"):
            with open(self.PATH + "/server.properties", "w") as file:
                for key, value in newconfig.items():
                    file.write(key + "=" + str(value) + "\n")
            return self.get_properties()
        else:
            with open(self.PATH + "/server.properties", "r") as file:
                lines = file.readlines()
            with open(self.PATH + "/server.properties", "w") as file:
                for line in lines:
                    if line.startswith("#"):
                        file.write(line)
                        continue
                    found = False
                    for key, value in newconfig.items():
                        if line.startswith(key):
                            file.write(key + "=" + str(value) + "\n")
                            found = True
                            break
                    if not found:
                        file.write(line)
        self.get_properties()
                
    def check_alive(self) -> bool:
        if self.rcon_password is None:
            return False
        if not self.is_server_on:
            try:
                self.rcon = RCONClient(self.host, port=self.rcon_port)
                # is_server_on = True
                if self.rcon.login(self.rcon_password):
                    self.status_server = get_process_info(self.rcon_port) 
                    self.is_server_on = True
            except ConnectionRefusedError as e:
                self.rcon = None
                print("----- ERROR -----    {}".format(e))
                return False
            
        try:
            self.status_server = get_process_info(self.rcon_port)
            if self.status_server["PID"] == 0:
                raise ConnectionRefusedError("Server is not running")
                
            if self.rcon.is_authenticated() and self.rcon.is_connected():
                self.is_server_on = True
                return True
            else:
                if self.rcon.login(self.rcon_password):
                    self.is_server_on = True
                    return True
        except Exception as e:
            self.rcon = None
            print("----- ERROR -----    {}".format(e))
            self.is_server_on = False
            return False

        

    def get_properties(self)->[str,str]:
        rcon_password = None
        rcon_port = None
        if not os.path.exists(self.PATH + "/server.properties"):
            return None, None
        with open(self.PATH + "/server.properties", "r") as file:
            lines = file.readlines()
            for line in lines:
                if line.startswith("#"):
                    continue
                param = line.split("=")
                key = param[0]
                value = param[1] if len(param) > 1 else ""
                value = value.replace("\n", "")
                if value.isdigit():
                    value = int(value)
                if type(value) == str:
                    if value.lower() == "true":
                        value = True
                    elif value.lower() == "false":
                        value = False
                self.config[key] = value
                # Buscamos la línea que contiene "rcon.password="
                if line.startswith("rcon.password="):
                    rcon_password = line.split("=")[1].strip()
                    continue

                # Buscamos la línea que contiene "rcon.port="
                if line.startswith("rcon.port="):
                    rcon_port = int(line.split("=")[1].strip())
                    continue

                # Si ya encontramos ambos valores, terminamos la búsqueda
                if rcon_password is not None and rcon_port is not None:
                    break
        return rcon_password, rcon_port
    
    def send_rcon_command(self, command):
        if self.rcon.login(self.rcon_password):
        # Send command to RCON - broadcast message to all players:
            resp = self.rcon.command(command)
            return resp 
    
    def send_content(self, other_content:str|list=None):
        if not os.path.exists(f'{self.PATH}/logs/latest.log'):
            return {'data': []}
        if type(other_content) == str:
            other_content = [other_content]
            
        f = open('{}/logs/latest.log'.format(self.PATH))
        newContent = f.read()
        
        if newContent != '':
            newContent = newContent.split('\n')[(-1*self.LIMIT_LINES):]
            try:
                indexNewContent = newContent.index(self.content[-1]) if len(self.content) > 0 else 0
            except:
                indexNewContent = -1
            if other_content != None:
                self.content += other_content
                f.close()
                f = open('{}/logs/latest.log'.format(self.PATH), 'w')
                f.write('\n'.join(self.content))
                f.close()
            if indexNewContent != -1:
                self.content += newContent[indexNewContent:]
            return {'data': self.content}
        
    def json(self):
        return {
            'name': self.name,
            'host': self.host,
            "id" : self.id,
            'config': self.config,
            'process_status': self.status_server,
            'status': "online" if self.is_server_on else "offline"
        }