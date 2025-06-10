"use client";

import ConfigOpts from "@/components/server/config_opt";
import { getServer } from "@/lib/get_server_data"
import { sendConfig } from "@/lib/pushServerData";
import { McServer } from "@/lib/types";
import { useFormStatus } from "react-dom";

export default function ConfigServer({ params, server }: { params: { id: string }, server: McServer | null }) {
    const { id } = params;
    if (!server) return <></>;

    async function handleSubmit(formData: FormData) {
        await sendConfig(formData, id);
    }

    return (
        <section className="pb-10">
            <form
                action={handleSubmit}
                className="bg-neutral-50 rounded-lg px-20 py-10 space-y-4"
            >
                <div className="flex border-b-2 pb-4">
                    <nav id="base" className="justify-between flex items-center w-full">
                        <h1 className="text-2xl text-black">Configuration</h1>
                        <button type="submit"
                            className=" bg-[#6cabad] hover:bg-[#0E8388] duration-300 transition-colors px-6 rounded-xl h-fit pt-1 pb-2 text-red-50 shadow-lg tracking-wide"
                        >Apply</button>
                    </nav>
                </div>
                <ul key={"optList"} className=" text-neutral-600 list-none grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3 gap-x-12 items-center">
                    <ConfigOpts default_values={server.config}></ConfigOpts>
                </ul>
            </form>
        </section>
    )
}
