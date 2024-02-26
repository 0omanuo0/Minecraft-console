import MCEditor from "@/components/server/editor"
import { Suspense, use, useEffect } from "react"
import { unstable_noStore as noStore } from 'next/cache';

import { getFileEdit } from "@/lib/get_server_data"

function getFileType(path: string) {
    const split = path.split(".");
    return split[split.length - 1];
}

export default async function Servers({ params, searchParams }: 
    { params: { id: string }; searchParams : { path: string }}
    ) {

    noStore();
    const content = await getFileEdit(params.id, searchParams.path);
    const fileType = getFileType(searchParams.path);

    return (
        
        <section className="space-y-4 rounded-xl pb-10">
            <div className=" items-center flex">
                <h1 className="text-xl text-white">Editing file: <span className=" text-lg font-extralight">{""}</span></h1>
                <div className="h-fit relative lg:flex ml-auto items-center">
                    {/* <span className={showSave ? "block" : "hidden" + " m-2 h-6 w-6"} id="save-icon">
                        <Image src={Save} alt="saveButton" className="mr-3" />
                    </span> */}
                    <button type="button"
                        className=" font-light bg-[#6cabad] hover:bg-[#0E8388] duration-300 transition-colors px-6 rounded-xl h-fit pt-1 pb-2 text-red-50 shadow-lg text-xl tracking-widest"
                    >save</button>
                </div>
            </div>
            <div className=" bg-white shadow-inner px-6 py-6 rounded-lg ">
                <div className=" bg-[#f5f2f0] shadow-inner px-6 py-10 rounded-lg h-fit">
                    <Suspense fallback={<p className=" text-black text-2xl">Loading...</p>}>
                        <MCEditor content={content} fileType={fileType} ></MCEditor>
                    </Suspense>
                </div>
            </div>
        </section>

    )
}