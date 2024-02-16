
import MCEditor from "@/components/server/editor"
import Save from "@/static/img/save.svg"
// import { useState } from "react"
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react"

import { getFileEdit } from "@/lib/get_server_data"

export default async function Servers({ params }: { params: { id: string } }) {

    // const searchParams = useSearchParams()
    // const file = searchParams.get("file")

    // const [showSave, setShowSave] = useState(false);

    // const click = (e: string | undefined) => {
    //     if (e != oldContent) setShowSave(true);
    //     else setShowSave(false);
    // }



    // let oldContent = content;

    const content = await getFileEdit(params.id, "/home/manu/mc_servers/truquito/logs/latest.log");


    return (
        
        <section className="space-y-4 rounded-xl">
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
            <div className=" bg-white shadow-inner px-6 py-6 rounded-lg">
                <div className=" bg-[#f5f2f0] shadow-inner px-6 py-10 rounded-lg h-fit">
                    <Suspense>
                        <MCEditor content={content} /*onChange={click}*/ ></MCEditor>
                    </Suspense>
                </div>
            </div>
        </section>

    )
}