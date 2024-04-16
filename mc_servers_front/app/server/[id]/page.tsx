"use client";

import ServerLogs from "@/components/server/serverLogs";

import Switch from "@/components/switch";
import { useEffect, useState } from "react";
import InputCommand from "@/components/server/send_command";
import io from "socket.io-client";


export default function Servers({ params }: { params: { id: string } }) {
    const [isSwitchChecked, setIsSwitchChecked] = useState(true);
    const handleSwitchToggle = (isChecked: boolean) => {
        setIsSwitchChecked(isChecked);
        console.log("AUTOSCROLL: " + isChecked);
    };
    const socket = io('http://localhost:12344');

    useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    });

    return (
        <section className="space-y-8">
            <div className="h-auto w-full bg-neutral-100 shadow-inner px-2 py-6 rounded-lg grid">
                <div className="flex mx-10 mb-6 mt-2 px-10 items-end text-3xl border-b-2 pb-4">
                    <h2 className="text-neutral-800" >Console</h2>
                    <nav id="base" className="relative text-base flex ml-auto items-center">
                        <Switch onToggle={handleSwitchToggle} name="Autoscroll: " checked={true}></Switch>
                    </nav>
                </div>

                <ServerLogs socket={socket} autoscroll={isSwitchChecked} id={params.id}></ServerLogs>
            </div>
            <div className="w-full">
                <InputCommand socket={socket} id={params.id}></InputCommand>
                <div id="autoOPT" className="cursor-div">
                    <ul className="list-none">
                        <li className="list_opt" id="OPTIONS"></li>
                    </ul>
                </div>
            </div>
        </section>
    )

}