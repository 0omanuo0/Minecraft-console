"use client";

import { Server } from "@/lib/types";
import { useEffect, useState } from "react";



export default function Status() {
    const [status, setStatus] = useState(
        serverStatusSkeleton
    );

    useEffect(() => {
        const getHostStatus = async () => {
            const res = await fetch(`/api/host`);
            const data: Server | undefined = await res.json();
            
            setStatus(
                serverStatus(data)
            );
        }
        // set interval to update status every 5s
        setInterval(async () => {
            getHostStatus();
        }, 5000);
        getHostStatus();
    }, []);



    return (
        <>
            {status}
        </>
    )
}

const serverStatus = (data: Server | undefined) => {
    console.log("CPU", data?.cpu);
    console.log("RAM", data?.ram);
    console.log("HOST", data?.host);
    if (!data) return serverStatusSkeleton;
    return (
        <section className=" bg-neutral-100 rounded-lg px-20 py-10 space-y-4">

            <div className="flex border-b-2 pb-4 text-black">
                <h1 className="text-2xl">Dashboard</h1>
            </div>
            <ul className="grid grid-cols-3 grid-flow-row gap-1 text-neutral-600">
                <li>Host: <span>{data.host}</span></li>
                <li>SO: <span>{data.SO}</span></li>
                <li>CPU cores: <span>{data.cpu.cores + " (" + data.cpu.name + ")"}</span></li>
                <li>CPU usage: <span>{data.cpu.cpuUsage}%</span></li>
                <li>RAM usage: <span>{((data.ram.usage/data.ram.total)*100).toFixed(2)}%</span></li>
                <li>RAM available: <span>{(data.ram.total / 1024 ** 3).toFixed(2)}GB</span></li>
            </ul>
        </section>
    )
}

const serverStatusSkeleton = (
    <section className=" bg-neutral-100 rounded-lg px-20 py-10 space-y-4">
        <div className="flex border-b-2 pb-4 text-black">
            <h1 className="text-2xl">Dashboard</h1>
        </div>
        <ul className="grid grid-cols-3 grid-flow-row gap-1 text-neutral-600">
            <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
            <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
            <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
            <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
            <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
            <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
        </ul>
    </section>
)