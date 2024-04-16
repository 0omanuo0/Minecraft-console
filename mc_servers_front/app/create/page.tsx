"use client";

import ConfigOpts from "@/components/server/config_opt";
import React, { useState, Suspense, useEffect, use } from "react";

import ServerOptions from "@/components/create/serverOptions";
import { getVersions } from "@/components/create/getVersions";
import { createServer } from "@/lib/actions";
import { toast } from "react-toastify";
import { get } from "http";
import { error } from "console";



export default function createNewServer() {
    const configOpts = require('@/data/server_properties_create.json');
    const [versions, setVersions] = useState<React.ReactElement[]>([]);
    // type is a object with all the errors of validation
    const [formState, setFormState] = useState<{ [key: string]: string }>({});

    // fetch all minecraft versions https://launchermeta.mojang.com/mc/game/version_manifest.json

    useEffect(() => {
        getVersions().then((data) => {
            setVersions(data);
        });
    }, []);


    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let errors: { [key in string]: string } = {};

        // get file from input id="zip"
        const file = document.getElementById('zip') as HTMLInputElement;
        let fileUploaded = file.files?.[0];
        // if there is a file, upload it
        if (file.files && fileUploaded) {
            // ensure that is a zip file before uploading
            if (fileUploaded.type !== 'application/x-zip-compressed' ) {
                toast.error("Please upload a valid zip file");
                errors["file"] = "Please upload a valid zip file";
            }
            else{
                toast.success("File uploaded successfully");
            }
        }

        // get form data
        const formData = new FormData(e.currentTarget);

        const opts: { [key in string]: any } = {};
        // server values
        const serverData = {
            serverName: formData.get('serverName'),
            launchConfig: {
                version: formData.get('Version'),
                rMin: Number(formData.get('rMin')),
                rMax: Number(formData.get('rMax')),
                port: Number(formData.get('Port'))
            },
            zip : fileUploaded ?? undefined,
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
            if(!fileUploaded){
                const fieldset = form?.querySelector('fieldset[name="ConfigOpts"]');
                // get all the values
                fieldset?.querySelectorAll('input').forEach((element) => {
                    serverData.ConfigOpts[element.id] = element.value;
                });
            }
            const createResponse = await createServer(serverData);
            // if everything is ok redirect to the server page
            if (createResponse) {
                toast.success("Server created successfully");
                window.location.href = "/dashboard?success=true";
            }
            else {
                toast.error("Error creating server. Please try again.");
            }
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