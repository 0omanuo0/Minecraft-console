"use client";

import ConfigOpts from "@/components/server/config_opt";
import React, { useState, Suspense, useEffect, use } from "react";

import ServerOptions from "@/components/create/serverOptions";
import { createServer } from "@/lib/actions";



export default function createNewServer() {
    const configOpts = require('@/data/server_properties_create.json');
    const [versions, setVersions] = useState<React.ReactElement[]>([]);
    // type is a object with all the errors of validation
    const [formState, setFormState] = useState<{ [key: string]: string }>({});

    // fetch all minecraft versions https://launchermeta.mojang.com/mc/game/version_manifest.json
    const getVersions = async (snapshots?: boolean) => {
        try {
            const response = await fetch('https://launchermeta.mojang.com/mc/game/version_manifest.json')

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();

            var versionsTmp: React.ReactElement[] = [];

            if (snapshots) {
                data.versions.forEach((element: { type: string; id: string; }) => {
                    versionsTmp.push(
                        <option key={element.id} value={element.id}>{element.id}</option>
                    );
                });
            }
            else {
                data.versions.forEach((element: { type: string; id: string; }) => {
                    if (element.type === 'release') {
                        versionsTmp.push(
                            <option key={element.id} value={element.id}>{element.id}</option>
                        );
                    }
                });
            }
            setVersions(versionsTmp);
            console.log(data);
        }
        catch (error) {
            console.error('There has been a problem with your fetch operation:', error);
        }
    }

    useEffect(() => {
        getVersions(false);
    }, []);


    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // get form data
        const formData = new FormData(e.currentTarget);
        let errors: { [key in string]: string } = {};

        const opts: { [key in string]: string } = {};
        // server values
        const serverData = {
            serverName: formData.get('serverName'),
            launchConfig: {
                version: formData.get('Version'),
                rMin: Number(formData.get('rMin')),
                rMax: Number(formData.get('rMax')),
                port: Number(formData.get('Port'))
            },
            ConfigOpts: opts
        }

        if (formData.get('serverName') === '')
            errors["serverName"] = "Please enter a server name.";
        const [rMin, rMax, port] = [serverData.launchConfig.rMin, serverData.launchConfig.rMax, serverData.launchConfig.port];
        if (isNaN(rMin) || isNaN(rMax) || port < 1024 || port > 65535 || isNaN(port) || rMin > rMax)
            errors["launchConfig"] = "Please enter a valid RAM and port";

        if (Object.keys(errors).length !== 0) {
            setFormState(errors);
            return;
        }
        else {
            // get the ConfigOpts fieldset from the form
            const form = document.querySelector('form');
            const fieldset = form?.querySelector('fieldset[name="ConfigOpts"]');
            // get all the values
            fieldset?.querySelectorAll('input').forEach((element) => {
                serverData.ConfigOpts[element.id] = element.value;
            });
            createServer(serverData);
        }

    }

    return (
        <form
            id="createServer"
            onSubmit={onSubmit}
            className="my-10 ml-[21rem] mr-10 "
        >
            <div className="flex items-center mb-10">
                <div className="">
                    <h1 className="text-2xl text-white">Create new server</h1>
                    <p className="text-neutral-100 font-extralight">Create a new server to manage</p>
                </div>
                <nav className=" relative hidden lg:flex items-center ml-auto pr-10">
                    <button
                        type="submit"
                        className=" text-xl bg-[#6cabad] hover:bg-[#0E8388] duration-200 transition-colors px-6 rounded-xl h-fit pt-2 pb-2 text-red-50 shadow-lg tracking-wide">
                        Build server!
                    </button>
                </nav>
            </div>
            <main
                className="grid-cols-2 gap-8 flex"
            >
                <ServerOptions
                    onChange={(e) => getVersions(e.target.checked)}
                    versions={versions}
                    formState={formState}
                >
                </ServerOptions>
                <section className="flex-grow-1 w-auto ">
                    <fieldset name="ConfigOpts">
                        <div
                            className="bg-neutral-100 rounded-lg px-20 py-10 space-y-4 "
                        >
                            <div className="flex border-b-2 pb-4">
                                <legend className="text-2xl text-black">Configuration</legend>
                            </div>
                            <ul key={"optList"} className=" text-neutral-600 list-none space-y-4 items-center overflow-y-scroll h-[50vh]">
                                <ConfigOpts default_values={configOpts}></ConfigOpts>
                            </ul>
                        </div>
                    </fieldset>
                </section>


            </main>
        </form>

    )
}