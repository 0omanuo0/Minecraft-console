"use client";

import StateSidebar from "@/components/statesSidebar";
import { useState } from "react";
import Link from "next/link";
import type { McServerList } from "@/lib/types";

export default function Sidebar({ serversList, }: Readonly<{ serversList: McServerList | undefined; }>) {
    // define state for show list when button pressed
    const [showList, setShowList] = useState(false);

    // define function to toggle show list
    const toggleList = () => {
        setShowList(!showList);
    }

    let servers = [<li className="text-white hover:opacity-80 transition-opacity duration-300">No servers</li>];
    if (serversList) {
        servers = serversList.map((server, index) => {
            return (
                <li key={index} className=" hover:border-l-2 pl-8 text-white hover:opacity-80 transition-opacity duration-300">
                    <Link href={`/server/${server.id}`}>
                        {server.name}
                        <StateSidebar state={server.status}></StateSidebar>
                    </Link>
                </li>
            )
        });
    }


    return (
        <div className="sidebar fixed top-0 bottom-0 lg:left-0 p-2 w-[300px] overflow-y-auto text-center bg-[#233333] h-[100vh]">
            <div className="text-gray-100 text-xl">
                <div className="p-2.5 mt-1 flex items-center">
                    <i className="bi bi-app-indicator px-2 py-1 rounded-md bg-[#2E4F4F]"></i>
                    <h1 className="font-bold text-gray-200 text-[15px] ml-3">Servers minecraft</h1>
                    <i className="bi bi-x cursor-pointer ml-28 lg:hidden" ></i>
                </div>
                <div className="my-2 bg-gray-400 h-[1px]"></div>
            </div>
            <div className="p-2.5 flex items-center rounded-md px-4 duration-300 cursor-pointer bg-[#414442] text-white shadow-md">
                <i className="bi bi-search text-sm"></i>
                <input type="text" placeholder="Search" className="text-[15px] ml-4 w-full bg-transparent focus:outline-none" />
            </div>
            <Link href={"/dashboard"} className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#0E8388] text-white">
                <i className="bi bi-house-door-fill"></i>
                <span className="text-[15px] ml-4 text-gray-200 font-bold text-lg">Home</span>
            </Link>
            <div onClick={toggleList} className="p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#0E8388] text-white">
                <i className="bi bi-hdd-network"></i>
                <span className="text-[15px] ml-4 text-gray-200 font-bold text-lg">Servers</span>
            </div>
            <div id="servers_list" className={showList ? "block" : "hidden" + " text-left mx-4 mt-4"}>
                <ul className=" space-y-2 font-litght text-left" >
                    <li key={"add"} className="hover:border-l-2 pl-6 text-white hover:opacity-80 transition-opacity duration-300 mt-2">
                        <a href="/create"><i className="bi bi-cloud-plus mr-2"></i>Create server</a>
                    </li>
                    {servers}
                </ul>
            </div>
            <div className="my-4 bg-gray-400 h-[1px]"></div>

            <div className=" w-full bottom-2 p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#0E8388] text-white">
                <i className="bi bi-box-arrow-in-right"></i>
                <span className="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
            </div>
        </div>

    )
}