var selected_item = "";

var editable_files = [".json", ".properties", ".txt", ".log"]

function display(rute) {
    var list = document.getElementById(rute)
    if (list.classList.contains("hidden")) {
        // Si tiene la clase, removerla
        list.classList.remove("hidden");
    }
    else {
        list.classList.add("hidden");
    }
}


function accionMenu(opt) {
    // Obtener la parte numérica de la URL actual
    var matches = window.location.href.match(/\/server\/(\d+)\/files/);
    var serverId = matches ? matches[1] : null;


    if (opt == "Edit" && serverId) {
        window.location.href = "/server/" + serverId + "/edit?q=" + selected_item;
        return;
    }
    else if (opt == "Download" && serverId) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', "/server/" + serverId + '/download' + '?q=' + selected_item, true);
        xhr.responseType = 'blob';

        xhr.onload = function () {
            // Crear un objeto URL para el blob
            var url = window.URL.createObjectURL(xhr.response);

            // Crear un enlace invisible y hacer clic en él para descargar el archivo
            var a = document.createElement('a');
            a.href = url;
            a.download = selected_item.split("/")[selected_item.split("/").length-1];
            document.body.appendChild(a);
            a.click();

            // Limpiar y liberar recursos
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        };

        xhr.send();
    }
}


function contextmenu(event, id) {
    event.preventDefault();


    var menu = document.getElementById('menu');
    var list_menu = document.getElementById('list_menu');
    menu.classList.remove("hidden");
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';

    selected_item = id;

    var edit_btn = document.getElementById("edit_btn");
    if (edit_btn) {
        edit_btn.remove();
    }

    editable_files.forEach(element => {
        if (id.endsWith(element)) {
            var edit_btn = document.createElement("li");
            edit_btn.innerHTML = "Edit";
            edit_btn.id = "edit_btn";
            edit_btn.className = " px-4 py-1 hover:bg-slate-100 hover:text-neutral-600";
            // execute accionMenu onclick
            edit_btn.onclick = () => accionMenu("Edit");
            list_menu.appendChild(edit_btn);
        }
    });

    document.addEventListener('click', function ocultarMenu() {
        //delete if exists
        var edit_btn = document.getElementById("edit_btn");
        if (edit_btn) {
            edit_btn.remove();
        }
        menu.classList.add("hidden");
        document.removeEventListener('click', ocultarMenu);
    });
}