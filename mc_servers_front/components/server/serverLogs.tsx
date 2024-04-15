"use client";

import { Dispatch, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';
import { notFound, redirect } from "next/navigation";

export default function ServerLogs({ id, autoscroll, socket }: { id: string; autoscroll:boolean; socket:Socket }) {

    const [logData, setLogData]: [JSX.Element[], Dispatch<any>] = useState([]);

    useEffect(() => {
        console.log("ready")
        // Conectarse al servidor Socket.IO
        //connect to server
        socket.connect();

        socket.on('connect', function () {
            socket.emit('my_event', { data: 'I\'m connected!' });
            socket.emit('update', { serverid: id });
        });
        // Listen for 'log' events from the server
        const intervalId = setInterval(() => {
            const div_log = document.getElementById("log_data");
            if (div_log&&autoscroll) div_log.scrollTop = div_log.scrollHeight;
            // Enviar el evento al servidor con el ID
            socket.emit('update', { serverid: id });
        }, 3000);

        // Escuchar eventos del servidor
        socket.on('recv', (data) => {
            if(data.data === undefined) window.location.replace("/dashboard");
            else setLogData(data.data);
        });


        // Cerrar la conexión y detener el intervalo cuando el componente se desmonta
        return () => {
            socket.disconnect();
            clearInterval(intervalId);
        };
    }, []);

    const log_data_rendered = logData.map((log_line, index) => {
        return <p key={index} className="text-black" >{log_line}</p>
    })

    return (
        <div className="h-[50vh] overflow-y-scroll border text-neutral-100 px-10 my-2" id="log_data">
            {log_data_rendered}
        </div>
    );
};
