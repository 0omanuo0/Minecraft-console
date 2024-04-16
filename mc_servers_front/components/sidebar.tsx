"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";

import type { McServerList } from "@/lib/types";
import StateSidebar from "@/components/statesSidebar";
import { get } from "https";
import { redirect } from "next/navigation";
import { Id } from "react-toastify";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const serversListSkeleton = [
    <li className="animate-pulse hover:border-l-2 transition-all pl-8 text-gray-500 hover:opacity-80 duration-100 items-center">
        <i className="bi bi-circle-fill text-xs mr-2  "></i>
        <span className="bg-gray-500 w-1/2 h-2 px-20 rounded-full"></span>
    </li>,
    <li className="animate-pulse hover:border-l-2 transition-all pl-8 text-gray-500 hover:opacity-80 duration-100 items-center">
        <i className="bi bi-circle-fill text-xs mr-2  "></i>
        <span className="bg-gray-500 w-1/2 h-2 px-20 rounded-full"></span>
    </li>,
    <li className="animate-pulse hover:border-l-2 transition-all pl-8 text-gray-500 hover:opacity-80 duration-100 items-center">
        <i className="bi bi-circle-fill text-xs mr-2  "></i>
        <span className="bg-gray-500 w-1/2 h-2 px-20 rounded-full"></span>
    </li>
]
let serverListOld: McServerList = [];
export default function Sidebar() {
    // define state for show list when button pressed
    const [showList, setShowList] = useState(true);

    // default skeleton list 3 elements
    const [serversList, setServersList] = useState(
        serversListSkeleton
    );


    // define function to toggle show list
    const toggleList = () => {
        setShowList(!showList);
    }

    useEffect(() => {
        const serversList = async () => {
            const response = await fetch("/api/servers");
            const data: McServerList | undefined = await response.json();
            // wait 3s
            // await new Promise(resolve => setTimeout(resolve, 5000));
            if (!data) redirect("/dashboard");
            if (data.length !== serverListOld.length) {
                toast("Server list updated");
                serverListOld = data;
            }
            setServersList(
                data.map(
                    (server, index) => {
                        return (
                            <li key={index} className=" hover:border-l-2 transition-all pl-8 text-white hover:opacity-80  duration-100 items-center">
                                <Link href={`/server/${server.id}`}>
                                    <i className="bi bi-circle-fill text-xs mr-2  "></i>
                                    {server.name}
                                    <StateSidebar state={server.status}></StateSidebar>
                                </Link>
                            </li>
                        )
                    }
                )
            )
        }

        serversList();

        // fetch getServers every 3 seconds
        setInterval(async () => {
            serversList();
        }, 5000);

    }, []);



    return (
        <>
            
            <div className="sidebar fixed top-0 bottom-0 lg:left-0 p-2 px-4 w-[16rem] overflow-y-auto text-center bg-[#233333] h-[100vh]">
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
                <div onClick={toggleList} className=" p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#0E8388] text-white">
                    <i className="bi bi-hdd-network"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold text-lg">Servers</span>
                </div>
                <div id="servers_list" className={showList ? "block" : "hidden" + " text-left mx-4 mt-4"}>
                    <ul className=" space-y-2 font-litght text-left" >
                        <li key={"add"} className="hover:border-l-2 pl-8 text-white hover:opacity-80 transition-all duration-100 mt-2">
                            <a href="/create"><i className="bi bi-cloud-plus mr-2 "></i>Create server</a>
                        </li>
                        {serversList}
                    </ul>
                </div>
                <div className="my-4 bg-gray-400 h-[1px]"></div>

                <div className=" w-full bottom-2 p-2.5 mt-3 flex items-center rounded-md px-4 duration-300 cursor-pointer hover:bg-[#0E8388] text-white">
                    <i className="bi bi-box-arrow-in-right"></i>
                    <span className="text-[15px] ml-4 text-gray-200 font-bold">Logout</span>
                </div>
            </div>
        </>
    )
}

