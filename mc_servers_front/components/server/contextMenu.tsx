import React, { useEffect } from "react";


enum ContextMenuOptions {
    DELETE   = "delete",
    RENAME   = "rename",
    FILE     = "file",
    FOLDER   = "folder",
    UPLOAD   = "upload",
    DOWNLOAD = "download"
}

const isFile = (path: string) => {
    return path.split(".").pop() === path ? undefined : path.split('.').pop();
}


export default function ContextMenu( {file, position}: {file: string; position: [number, number]}) {
    // 

    const contextCommand = (e: React.MouseEvent, file:string) => {
        // prevent parect onclick
        e.preventDefault();
        console.log(e.currentTarget.id + file);
        if(e.currentTarget.id === ContextMenuOptions.DOWNLOAD){
            console.log("Option: Download");
        }
    }
    
    // move menu to mouse position when useEffect is called
    useEffect(()=>{
        const menu = document.getElementById('menu');
        if(menu){
            menu.style.left = `${position[0]}px`;
            menu.style.top = `${position[1]}px`;
        }
        console.log("File: " + file);
        console.log("isUndefined: " + isFile(file));
        
    });


    return (
        <div id="menu" className="absolute bg-white rounded-lg shadow-lg py-2">
            <ul id="list_menu" className=" space-y-2">
                <li key={"download"} > <button onClick={(e)=>{contextCommand(e, file)}} id={"download"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Download   </button> </li>
                <li key={"delete"} > <button onClick={(e)=>{contextCommand(e, file)}} id={"delete"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hovers:text-neutral-600" >Delete          </button> </li>
                <li key={"rename"} > <button onClick={(e)=>{contextCommand(e, file)}} id={"rename"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Rename         </button> </li>
                {
                    !isFile(file) ? 
                    <>
                        <li key={"file"} >   <button onClick={(e)=>{contextCommand(e, file)}} id={"file"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Create file        </button> </li>
                        <li key={"folder"} > <button onClick={(e)=>{contextCommand(e, file)}} id={"folder"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Create folder  </button> </li>
                        <li key={"upload"} > <button onClick={(e)=>{contextCommand(e, file)}} id={"upload"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Upload         </button> </li>
                    </>:
                    null
                }
                
            </ul>
        </div>
    )
}