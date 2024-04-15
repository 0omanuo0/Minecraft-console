"use client";

import { McServer, States, SectionsObj } from "@/lib/types"
import StateSidebar from "@/components/statesSidebar"
// get url
import { notFound, usePathname } from "next/navigation"
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

export default function HeadServer({ server, id }: Readonly<{ server: McServer; id:string }>) {
    // find section of /servers/id/[section]
    const path = usePathname()
    let section = path.split("/")[3];
    if (section == undefined) section = "console";
    if (sections[section] != undefined) {
        section = section;
    }

    console.log("Server: " + server.status)

    return (
        <>
            <section className=" border-b-2 pb-6">
                <h1 className="text-2xl text-white">Server details - {server.name}</h1>
                <p className=" text-neutral-100 font-extralight">UUID: {server.id}</p>
                <div className=" flex">
                    <div className="relative hidden lg:flex ml-auto -mt-14">
                        {
                            server.status === States.Online &&
                            <ButtonStop id={id}/>
                        }
                        {
                            server.status === States.Offline &&
                            <ButtonStart id={id}/>
                        }
                    </div>
                </div>

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
                    {
                        Object.keys(sections).map((section_name, index) => {
                            return (
                                <li key={section_name} id={section_name} className={clsx("flex-1 text-center rounded-full px-1 py-1",
                                    {
                                        "bg-gray-200": section === section_name
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
                </ul>
                <span className="bg-gray-200 hidden">Dummy</span>

            </section>
        </>

    )
}