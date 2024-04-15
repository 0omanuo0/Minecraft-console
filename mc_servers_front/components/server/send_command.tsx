"use client";

import { useEffect } from "react";
import { api_ip } from "@/lib/get_server_data"
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';



export default function InputCommand({ id, socket }: Readonly<{ id: string; socket:Socket }>) {

    const sendCommand = () => {
        const input = document.getElementById("content") as HTMLInputElement;
        const command = {
            command: input.value,
            serverid:id
        };

        // send with socketio the vaule
        socket.emit('send_command', command);
        input.value = "";
        input.focus();
        return false; // prevent form submission from reloading the page
    };


    return (
        <form id="command-form" className="mb-4" action={sendCommand} >
            <input type="text" id="content" name="content" autoComplete="off"
                className="w-full relative bg-gray-50 ring-0 outline-none border border-[#233333] text-neutral-900 placeholder-[#233333] text-sm rounded-lg focus:ring-[#466666]   focus:border-[#466666]  block p-2.5 checked:bg-emerald-500"
                placeholder="Command...">
            </input>
        </form>
    );
}