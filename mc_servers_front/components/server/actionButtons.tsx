import { start, stop } from "@/lib/pushServerData";
import { getServer } from "@/lib/get_server_data"
import { useState, useEffect } from "react";
import { redirect } from "next/navigation";


export function ButtonStart({ id }: { id: string }) {
    const [serverOnline, setServerOnline] = useState(true);

    return (
        <form action={
            () => {
                start(id);
                // redirect(`/server/${id}`);
            }
        }>
            <button type="submit" className=" bg-[#6cabad] hover:bg-[#0E8388] duration-300 transition-colors px-12 rounded-xl h-fit py-3 text-red-50 shadow-lg text-xl tracking-widest">
                Start
            </button>
        </form>
    );
}
export function ButtonStop({ id }: { id: string }) {
    return (
        <div className="flex items-center">
            <form method="post" className="" action={
                () => {
                    stop(id);
                    // redirect(`/server/${id}`);
                }
            }>
                <button type="submit" className=" mr-4 hover:animate-pulse " >
                    <i className="bi bi-arrow-counterclockwise text-3xl hover:text-neutral-300 transition-all duration-200 "></i>
                </button>
            </form>
            <form method="post" className="" action={
                () => {
                    stop(id);
                    // redirect(`/server/${id}`);
                }
            }>
                <button type="submit" className=" bg-[#834c61] hover:bg-[#682533] duration-300 transition-colors px-12 rounded-xl h-fit py-3 text-red-50 shadow-lg text-xl tracking-widest">
                    Stop
                </button>
            </form>
        </div>
    );
}