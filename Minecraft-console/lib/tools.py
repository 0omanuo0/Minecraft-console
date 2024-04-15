import psutil
import socket
import platform
import os


def get_host_status():
    cpu_percent = psutil.cpu_percent()
    cpu_count = psutil.cpu_count()
    ram = psutil.virtual_memory()
    hostname = socket.gethostname()
    SO = platform.uname().system + " " +  " " + platform.uname().release
    cpu_type = platform.uname().processor
    return {"cpu":cpu_percent, "cpu_count":cpu_count, "ram":ram, "hostname":hostname, "SO":SO, "cpu_type":cpu_type}


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
                        'PID': proceso.info['pid'],
                        'CMD': "".join(get_cmd(proceso.info['pid'])),
                        'RAM': "{:10.2f}".format(proceso.info['memory_info'].rss/1024**3),
                        'CPU': "{:10.2f}".format(proceso.info['cpu_percent'])
                    }
        except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
            pass
    return {'PID': 0, 'CMD': "None", 'RAM': 0.0, 'CPU': 0.0}