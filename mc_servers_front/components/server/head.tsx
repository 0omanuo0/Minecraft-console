"use client";

import { McServer, States, SectionsObj } from "@/lib/types"
import StateSidebar from "@/components/statesSidebar"
// get url
import { notFound, usePathname, redirect } from "next/navigation"
import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { ButtonStart, ButtonStop } from "@/components/server/actionButtons";
import { sections } from "@/lib/server_sections";



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

export default function HeadServer(
    { id, server, setSelection, selection }
        : Readonly<{ id: string, server: McServer | null, setSelection: (section: string) => void, selection: string }>) {

    const names = Object.keys(sections);
    const count = names.length;




    const pathname = usePathname();

    function handleSelection(section_name: string) {
        setSelection(section_name);
        // push to history as a query parameter
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set("section", section_name);
        const newUrl = `${pathname}?${searchParams.toString()}`;
        window.history.pushState({}, "", newUrl);
    }

    useEffect(() => {
        // get query parameter from url
        const searchParams = new URLSearchParams(window.location.search);
        const section = searchParams.get("section");
        if (section && names.includes(section)) {
            setSelection(section);
        }
        else {
            // if section is not in names, set to first section
            setSelection(names[0]);
        }
    }, [names]);

    if (!server) {
        return skeleton_head
    }

    return (
        <header>
            <section className=" pb-6">
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
            <section className="bg-white px-10 lg:px-16 2xl:px-32 gap-2 py-4 pt-6 rounded-lg text-neutral-600">
                <ul className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 grid-flow-row gap-2">
                    <li key={"name"}>Server: <span>{server.name} <StateSidebar state={server.status}></StateSidebar> </span></li>
                    <li key={"host"}>Host: <span>{server.host} </span></li>
                    <li key={"PID"}>PID: <span>{server.process_status.PID} </span></li>
                    <li key={"CPU"}>CPU usage: <span>{server.process_status.CPU} </span>%</li>
                    <li key={"RAM"}>RAM usage: <span>{server.process_status.RAM} </span>GB</li>
                    <li key="CMD" className="truncate inline max-w-xs cursor-pointer">
                        cmd: <span
                            onClick={() => navigator.clipboard.writeText(server.process_status.CMD)}
                            title={"Click to copy: " + server.process_status.CMD}>{server.process_status.CMD}</span>
                    </li>
                </ul>
                <ul className=" relative flex items-center justify-between mt-6 w-full bg-neutral-400/40 px-1 py-1 rounded-2xl">
                    <div
                        style={{
                            // make it exactly one tab wide
                            width: `${100 / count}%`,
                            // move it over by N × its own width
                            transform: `translateX(${names.indexOf(selection) * 100}%)`,
                        }}
                        className="absolute h-8 w-24 bg-white/60 rounded-xl transition-all duration-300 ease-in-out"
                    ></div>
                    {
                        Object.keys(sections).map((section_name, index) => {
                            return (
                                <li
                                    key={section_name} id={section_name}
                                    className={"relative z-10 text-center rounded-full px-1 py-1 flex-1 " + (sections[section_name].Path ? "text-black cursor-pointer" : "text-neutral-500")}
                                    onClick={() => handleSelection(section_name)}
                                >
                                    {
                                        sections[section_name].name
                                    }

                                </li>
                            )
                        })
                    }
                </ul>
            </section>
        </header>
    )
}