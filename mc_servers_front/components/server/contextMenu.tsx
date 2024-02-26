import React, { useEffect } from "react";



export default function ContextMenu( {file, position}: {file: string; position: [number, number]}) {
    // 

    const contextCommand = (e: React.MouseEvent, file:string) => {
        // prevent parect onclick
        e.preventDefault();
        console.log(e.currentTarget.id + file);
    }
    
    // move menu to mouse position when useEffect is called
    useEffect(()=>{
        const menu = document.getElementById('menu');
        if(menu){
            menu.style.left = `${position[0]}px`;
            menu.style.top = `${position[1]}px`;
        }
        
    });


    return (
        <div id="menu" className="absolute bg-white rounded-lg shadow-lg py-2">
            <ul id="list_menu" className=" space-y-2">
                <li onClick={(e)=>{contextCommand(e, file)}} id={"delete"} key={"delete"} className=" px-4 py-1 hover:bg-slate-100 hovers:text-neutral-600" >Delete       </li>
                <li onClick={(e)=>{contextCommand(e, file)}} id={"rename"} key={"rename"} className=" px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Rename       </li>
                <li onClick={(e)=>{contextCommand(e, file)}} id={"file"} key={"file"} className=" px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Create file  </li>
                <li onClick={(e)=>{contextCommand(e, file)}} id={"folder"} key={"folder"} className=" px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Create folder</li>
                <li onClick={(e)=>{contextCommand(e, file)}} id={"upload"} key={"upload"} className=" px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Upload       </li>
                <li onClick={(e)=>{contextCommand(e, file)}} id={"download"} key={"download"} className=" px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Download     </li>
            </ul>
        </div>
    )
}