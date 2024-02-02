from mctools import RCONClient
import os
import psutil


def generate_tree(ruta:str, name:str):
    arbol = {'rute': ruta, 'files': [], 'dir': [], "name":name}

    try:
        # Obtener la lista de archivos y directorios en la ruta proporcionada
        contenido = os.listdir(ruta)
        arbol["name"] = ruta.split("/")[-1]

        for elemento in contenido:
            ruta_completa = os.path.join(ruta, elemento)

            if os.path.isfile(ruta_completa):
                # Es un archivo, añadirlo a la lista de archivos
                arbol['files'].append(elemento)
            elif os.path.isdir(ruta_completa):
                # Es un directorio, añadirlo a la lista de directorios y generar su árbol
                sub_arbol = generate_tree(ruta_completa, elemento)
                arbol['dir'].append(sub_arbol)

    except OSError as e:
        pass

    return arbol


def get_process_info(puerto):
    def get_cmd(pid):
        try:
            process = psutil.Process(pid)
            return process.cmdline()
        except psutil.NoSuchProcess:
            return None
    for proceso in psutil.process_iter(['pid', 'name', 'memory_info', 'cpu_percent']):
        try:
            conexiones = proceso.connections()
            for conexion in conexiones:
                if conexion.laddr.port == puerto:
                    return {
                        'pid': proceso.info['pid'],
                        'cmd': get_cmd(proceso.info['pid']),
                        'ram': proceso.info['memory_info'].rss/1024**3,
                        'cpu': proceso.info['cpu_percent']
                    }
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return {
                'pid': 0,
                'cmd': "None",
                'ram': 0.0,
                'cpu': 0.0
            }

class McServer ():
    LIMIT_LINES = 500
    def __init__(self, name:str, host:str=None, path:str=None) -> None:
        self.name = name
        self.PATH = path if path is not None else '/home/manu/mc_servers/truquito'
        self.config = {}
        self.rcon_password, self.rcon_port = self.get_properties()

        self.status_server = get_process_info(self.rcon_port) 

        self.host = 'localhost' if host is None else host
        self.is_server_on = False

        self.content = ''

        try:
            self.rcon = RCONClient(host, port=self.rcon_port)
            # is_server_on = True
            if self.rcon.login(self.rcon_password):
                self.is_server_on = True
        except:
            self.rcon = None
            print("----- ERROR -----    No se ha podido conectar al servidor")

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
            if not self.is_server_on:
                return {'data': ""}
            #return list whith only last three elements
            self.content = self.content.split('\n')[(-1*self.LIMIT_LINES):]
            if other_content != '':
                self.content.append(other_content)
                f.close()
                f = open('{}/logs/latest.log'.format(self.PATH), 'w')
                f.write('\n'.join(self.content))
                f.close()
            return {'data': self.content}