"use client";

import { McServer, States, SectionsObj } from "@/lib/types"
import StateSidebar from "@/components/statesSidebar"
// get url
import { notFound, usePathname, redirect } from "next/navigation"
import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from 'clsx';
import { ButtonStart, ButtonStop } from "@/components/server/actionButtons";

const sections: SectionsObj = {
    "console": {
        name: "Console",
        Path: "/"
    },
    "files": {
        name: "Files",
        Path: "/files"
    },
    "config": {
        name: "Config",
        Path: "/config"
    },
    "stats": {
        name: "Stats",
        Path: ""
    },
    "backups": {
        name: "Backups",
        Path: ""
    },
    "schedule": {
        name: "Schedule",
        Path: ""
    }
}

const skeleton_head = (
    <>
        <section className=" border-b-2 pb-6 bg-transparent animate-pulse space-y-2">
            <h1 className="text-2xl bg-gray-500/80 px-40 h-8 w-2 rounded-full"></h1>
            <p className="space-x-2 h-4"> <span className="text-2xl bg-gray-500/60 px-10 h-4 w-2 rounded-full"></span>
                <span className="text-2xl bg-gray-500/60 px-32 h-4 w-2 rounded-full"></span></p>

            <div className=" flex">
                <div className="relative hidden lg:flex ml-auto -mt-14">
                    <button type="submit" className=" bg-[#6cabad] hover:bg-[#0E8388] duration-300 transition-colors px-12 rounded-xl h-fit py-3 text-red-50 shadow-lg text-xl tracking-widest">
                        <span className="px-6 h-4 w-2 rounded-full"></span>
                    </button>
                </div>
            </div>

        </section>
        <section className="bg-white px-10 lg:px-32 gap-2 py-4 rounded-lg text-neutral-600">
            <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-flow-row gap-2">
                <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
                <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
                <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
                <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
                <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
                <li><span className="space-x-2"> <span className="bg-gray-500/60 px-8 h-4 w-2 rounded-full"></span> <span className="bg-gray-500/60 px-4 h-4 w-2 rounded-full"></span> </span></li>
            </ul>
            <ul className=" flex mt-6 gap-2">
                {
                    Object.keys(sections).map((section_name, index) => {
                        return (
                            <li key={section_name} id={section_name} className="flex-1 text-center rounded-full px-1 py-1 h-6 bg-gray-200">

                            </li>
                        )
                    })
                }
            </ul>
        </section>
    </>
);

export default function HeadServer({ id }: Readonly<{ id: string }>) {
    // find section of /servers/id/[section]

    const [server, setServer] = useState(skeleton_head);

    useEffect(() => {

        const serversList = async () => {
            const response = await fetch("/api/server/" + id);
            const server: McServer | undefined = await response.json();
            if (!server) {
                notFound();
            }
            setServer(
                <>
                    <section className=" border-b-2 pb-6">
                        <h1 className="text-2xl text-white">Server details - {server.name}</h1>
                        <h3 className=" text-neutral-100 font-extralight">UUID: {server.id}</h3>
                        <nav className=" flex">
                            <div className="relative hidden lg:flex ml-auto -mt-14">
                                {
                                    server.status === States.Online &&
                                    <ButtonStop id={id} />
                                }
                                {
                                    server.status === States.Offline &&
                                    <ButtonStart id={id} />
                                }
                            </div>
                        </nav>

                    </section>
                    <section className="bg-white px-10 lg:px-32 gap-2 py-4 rounded-lg text-neutral-600">
                        <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-flow-row gap-2">
                            <li key={"name"}>Server: <span>{server.name} <StateSidebar state={server.status}></StateSidebar> </span></li>
                            <li key={"host"}>Host: <span>{server.host} </span></li>
                            <li key={"PID"}>PID: <span>{server.process_status.PID} </span></li>
                            <li key={"CPU"}>CPU usage: <span>{server.process_status.CPU} </span>%</li>
                            <li key={"RAM"}>RAM usage: <span>{server.process_status.RAM} </span>GB</li>
                            <li key={"CMD"}>cmd: <span>{server.process_status.CMD} </span></li>
                        </ul>
                        <ul className=" flex mt-6">
                                <Sections id={id}></Sections>
                        </ul>
                    </section>
                </>
            );

        }

        // refresh every 5 seconds
        setInterval(async () => {
            serversList();
        }, 5000);

        serversList();
    }, []);


    return (
        <>
            {server}
        </>
    )
}

function Sections({id}: {id:string}) {
    // get last element of path, if is undefined, return "console"
    const pathName = usePathname().split("/")[3] || "console";
    return Object.keys(sections).map((section_name, index) => {
        return (
            <li key={section_name} id={section_name} className={clsx("flex-1 text-center rounded-full px-1 py-1",
                {
                    "bg-gray-200": pathName === section_name
                },
            )}
            >
                {sections[section_name].Path &&
                    <Link href={"/server/" + id + sections[section_name].Path}>{sections[section_name].name}</Link>
                }
                {!sections[section_name].Path &&
                    sections[section_name].name
                }

            </li>
        )
    })
}