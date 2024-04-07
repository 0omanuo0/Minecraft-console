"use client";
import MCEditor from "@/components/server/editor"
import { Suspense, use, useEffect, useState } from "react"
import { editFile } from "@/lib/pushServerData";


export default function editorSection({content, fileType, id, path}: {content: string, fileType: string, id: string, path: string}){
    const [ editorContent, setEditorContent ] : [string|undefined, any] = useState(content);

    return (

        <form
            action={
                async (formData: FormData) => {
                    if(editorContent) formData.append("content", editorContent);
                    
                    editFile(formData, id, path);
                }
            }
        >
            <div className=" items-center flex">
                <h1 className="text-xl text-white">Editing file: <span className=" text-lg font-extralight">{""}</span></h1>
                <div className="h-fit relative lg:flex ml-auto items-center">
                    {/* <span className={showSave ? "block" : "hidden" + " m-2 h-6 w-6"} id="save-icon">
                        <Image src={Save} alt="saveButton" className="mr-3" />
                    </span> */}
                    <button type="submit"
                        className=" font-light bg-[#6cabad] hover:bg-[#0E8388] duration-300 transition-colors px-6 rounded-xl h-fit pt-1 pb-2 text-red-50 shadow-lg text-xl tracking-widest"
                    >save</button>
                </div>
            </div>
            <div className=" bg-white shadow-inner px-6 py-6 rounded-lg ">
                <div className=" bg-[#f5f2f0] shadow-inner px-6 py-10 rounded-lg h-fit">
                    <Suspense fallback={<p className=" text-black text-2xl">Loading...</p>}>
                        <MCEditor onChange={(newContent)=>{setEditorContent(newContent)}} content={content} fileType={fileType} ></MCEditor>
                    </Suspense>
                </div >
            </div>
        </form>

    )
}