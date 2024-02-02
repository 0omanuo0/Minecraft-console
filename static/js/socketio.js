var socket;
$(document).ready(function () {
    // Connect to the Socket.IO server.
    // The connection URL has the following format, relative to the current page:
    //     http[s]://<domain>:<port>[/<namespace>]
    socket = io();
    // Event handler for new connections.
    // The callback function is invoked when a connection with the
    // server is established.
    socket.on('connect', function () {
        socket.emit('my_event', { data: 'I\'m connected!' });
        $('#transport').text(socket.io.engine.transport.name);
        socket.emit('update', { serverid: location.pathname });
    });

    window.setInterval(function () {
        $('#transport').text(socket.io.engine.transport.name);
        socket.emit('update', { serverid: location.pathname });
    }, 3000);

    socket.on('recv', function (data) {
        var data = data.data;
        var log_data = document.getElementById("log_data")
        log_data.innerHTML = ""
        //store data list elements in html appending <b> tag to bold the text
        for (var i = 0; i < data.length; i++) {
            var parrafo = document.createElement("p")
            parrafo.textContent = data[i]
            log_data.appendChild(parrafo);
        }
        if (switchScroll()) {
            log_data.scrollTop = log_data.scrollHeight;
        }
    });

    document.getElementById("submit-button").addEventListener("click", function (event) {
        // Get the input value
        const inputField = document.getElementById('content')
        const command = inputField.value.trim();

        // Send the command via the socket
        if (command !== '') {
            socket.emit('send_command', { command: command, serverid: location.pathname });
            inputField.value = ''; // Clear the input field after sending
            console.log(socket)
            console.log("sent")
        }
    });
});

