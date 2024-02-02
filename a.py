import os

def generate_tree(ruta:str):
    arbol = {'rute': ruta, 'files': [], 'dir': []}

    try:
        # Obtener la lista de archivos y directorios en la ruta proporcionada
        contenido = os.listdir(ruta)

        for elemento in contenido:
            ruta_completa = os.path.join(ruta, elemento)

            if os.path.isfile(ruta_completa):
                # Es un archivo, añadirlo a la lista de archivos
                arbol['files'].append(elemento)
            elif os.path.isdir(ruta_completa):
                # Es un directorio, añadirlo a la lista de directorios y generar su árbol
                sub_arbol = generate_tree(ruta_completa)
                arbol['dir'].append(sub_arbol)

    except OSError as e:
        pass

    return arbol

print(generate_tree("/home/manu/mc_servers/truquito"))