"use client";
import ListFiles from "./fileList";
import { createContext, Suspense } from "react";
import { getServerFiles } from "@/lib/get_server_data";

export const FilesContext = createContext({
    fetchData: null as ((id: string) => Promise<void>) | null,
    files: null as any,
    setFiles: null as ((files: any) => void) | null,
});

export default function Files({ params }: { params: { id: string } }) {
    const { id } = params;

    return (
        <section className="pb-10 ">
            <div className="bg-neutral-100 rounded-xl text-neutral-600 p-10 ">
                <Suspense fallback={<div>Loading...</div>}>
                    <ListFiles id={id}></ListFiles>
                </Suspense>
            </div>
        </section>
    );
}

