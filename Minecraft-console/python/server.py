from mctools import RCONClient
from python.tools import get_process_info

class McServer ():
    LIMIT_LINES = 500
    def __init__(self, name:str, id:str, host:str=None, path:str=None) -> None:
        self.name = name
        self.id = id
        self.PATH = path if path is not None else ''
        self.config = {}
        self.rcon_password, self.rcon_port = self.get_properties()

        self.status_server = get_process_info(self.rcon_port) 

        self.host = 'localhost' if host is None else host
        self.is_server_on = False

        self.content = ''
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
        if not self.is_server_on:
            try:
                self.rcon = RCONClient(self.host, port=self.rcon_port)
                # is_server_on = True
                if self.rcon.login(self.rcon_password):
                    self.is_server_on = True
            except:
                self.rcon = None
                print("----- ERROR -----    No se ha podido conectar al servidor")

        self.is_server_on = False
        try:
            if self.rcon.login(self.rcon_password):
                self.is_server_on = True
        except:
            self.rcon = None
            print("----- ERROR -----    No se ha podido conectar al servidor")
        return self.is_server_on  

    def get_properties(self)->[str,str]:
        rcon_password = None
        rcon_port = None
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
    
    def send_content(self, other_content=""):
        f = open('{}/logs/latest.log'.format(self.PATH))
        self.content = f.read()
        if self.content != '':
            # if not self.is_server_on:
            #     return {'data': ""}
            #return list whith only last three elements
            self.content = self.content.split('\n')[(-1*self.LIMIT_LINES):]
            if other_content != '':
                self.content.append(other_content)
                f.close()
                f = open('{}/logs/latest.log'.format(self.PATH), 'w')
                f.write('\n'.join(self.content))
                f.close()
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