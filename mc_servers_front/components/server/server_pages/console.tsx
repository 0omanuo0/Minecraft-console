"use client";

import Switch from "@/components/switch";
import InputCommand from "@/components/server/send_command";
import { useState } from "react";
import io from "socket.io-client";
import ServerLogs from "@/components/server/serverLogs";




export default function Console({ params }: { params: { id: string } }) {
    const [isIncreasing, setIsIncreasing] = useState(false);
    const [addheight, setHeight] = useState(0);
    const [switchChecked, setSwitchChecked] = useState(true);

    const handleSwitchToggle = (isChecked: boolean) => {
        setSwitchChecked(!isChecked);
        console.log("AUTOSCROLL: " + !isChecked);
    };

    const socket = io('http://localhost:12344');

    return (
        <section
            className="space-y-2 pb-4"
            onMouseMove={(e) => {
                if (isIncreasing) {
                    e.preventDefault();
                    // the movement increases the height of the console, but don't allow negative values
                    const newHeight = e.movementY + addheight;
                    setHeight(newHeight < 0 ? 0 : newHeight);
                    // scroll to the bottom of hole document
                    // document.documentElement.scrollTop = document.documentElement.scrollHeight;
                }
            }}
            onMouseUp={(e) => {
                setIsIncreasing(false);
            }}
        >

            <div className="h-auto w-full bg-neutral-100 shadow-inner overflow-hidden pt-6 rounded-lg grid">
                <div className="flex mx-10 px-10 items-end text-3xl border-b-2 border-neutral-700 pb-2">
                    <h2 className="text-neutral-800" >Console</h2>
                    <nav id="base" className="relative text-base flex ml-auto items-center">
                        <Switch onToggle={handleSwitchToggle} name="Autoscroll: " checked={switchChecked}></Switch>
                    </nav>
                </div>

                <ServerLogs socket={socket} autoscroll={switchChecked} id={params.id} addheight={addheight}></ServerLogs>
                <div
                    onMouseDown={(e) => {
                        setIsIncreasing(true);
                    }}
                    onMouseUp={(e) => {
                        setIsIncreasing(false);
                    }}

                    className="h-2 w-full bg-neutral-200 mt-6 cursor-row-resize"></div>
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
    );
}