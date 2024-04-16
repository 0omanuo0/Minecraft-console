"use client";
import { on } from "events";
import React, { useState } from "react";

export let FileUploaded: File | undefined = undefined;

export default function ServerOptions({ children, onChange, versions, formState }:
    { children?: React.JSX.Element; onChange: (event: React.ChangeEvent<HTMLInputElement>) => void; versions: React.ReactElement[]; formState: { [key: string]: string } }
) {


    return (
        <section className="  relative flex-grow bg-neutral-100 rounded-lg px-10 py-10 space-y-6 text-black">
            {children}
            <ConfigSections id="name" title="Server name">
                <input
                    name="serverName"
                    id="serverName"
                    type="text"
                    className=" outline-none w-full bg-transparent border-2 px-2 py-1 rounded-lg border-neutral-500 text-md text-black focus:shadow-inner focus:shadow-neutral-300"
                    placeholder="My server"
                />
                <div aria-live="polite" aria-atomic="true">
                    {
                        // if the formState has a serverName key, show the error message else placeholder with the same height
                        formState.serverName ? <span className="text-red-500">{formState.serverName}</span> : <></>
                    }
                </div>
            </ConfigSections>

            <ConfigSections id="version" title="Minecraft version">
                <div className="flex items-center">
                    <select
                        name="Version"
                        className=" px-4 py-2 bg-transparent rounded-lg border-2 border-neutral-500 w-32"
                        id=""
                    >
                        {versions}
                    </select>
                    <div className=" text-lg mx-6 space-x-2">
                        <input
                            className=""
                            type="checkbox"
                            defaultChecked={false}
                            id="snapshots"
                            onChange={
                                onChange
                            }
                        ></input>
                        <span>Snapshots</span>
                    </div>
                </div>
            </ConfigSections>
            <ConfigSections id="launch" title="Launch config">
                <div className="grid grid-cols-3 space-x-2 w-auto text-sm text-neutral-700">
                    <label htmlFor="">RAM Max (GB)</label>
                    <label htmlFor="">RAM Min (GB)</label>
                    <label htmlFor="">Port</label>
                </div>
                <div className="grid grid-cols-3 space-x-2">
                    <input
                        id="rMax"
                        name="rMax"
                        type="number"
                        defaultValue={1.1}
                        className=" w-24 outline-none bg-transparent border-2 px-2 py-1 rounded-lg border-neutral-500 text-md text-black focus:shadow-inner focus:shadow-neutral-300"
                    />
                    <input
                        id="rMin"
                        name="rMin"
                        type="number"
                        defaultValue={1.1}
                        className=" w-24 outline-none bg-transparent border-2 px-2 py-1 rounded-lg border-neutral-500 text-md text-black focus:shadow-inner focus:shadow-neutral-300"
                    />
                    <input
                        id="Port"
                        name="Port"
                        type="number"
                        defaultValue={25565}
                        className=" w-24 outline-none bg-transparent border-2 px-2 py-1 rounded-lg border-neutral-500 text-md text-black focus:shadow-inner focus:shadow-neutral-300"
                    />
                </div>
                <div aria-live="polite" aria-atomic="true">
                    {
                        // if the formState has a serverName key, show the error message else placeholder with the same height
                        formState.launchConfig ? <span className="text-red-500">{formState.launchConfig}</span> : <></>
                    }
                </div>
            </ConfigSections>

            <div className="absolute bottom-6 mr-10">
                <h2 className=" border-b-2 border-neutral-200 mb-3">Instead import folder (as zip)</h2>
                {
                    formState.file ? <span className="text-red-500">{formState.file}</span> : <></>
                }
                <div className="flex items-center">
                    <input
                        id="zip"
                        name="zip"
                        onChange={(e) => { FileUploaded = e.target.files?.[0] }}
                        type="file"
                        className=" outline-none w-full bg-transparent border-2 px-2 py-1 rounded-lg border-neutral-500 text-md text-black focus:shadow-inner focus:shadow-neutral-300"
                    />
                </div>
            </div>

        </section>
    )
}





const ConfigSections = (
    {
        children,
        title,
        id,
        className
    }: { children: React.ReactElement[] | React.ReactElement; title: string; id: string; className?: string | undefined }) => {

    return (
        <div id={id} className={className}>
            <h2 className=" text-lg  border-b-2 border-neutral-200 mb-1">{title}</h2>
            {children}
        </div>
    );
}