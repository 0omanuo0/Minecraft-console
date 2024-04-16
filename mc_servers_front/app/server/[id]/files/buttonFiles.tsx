"use client";

import React, { ReactNode, useState } from "react"
import Link from "next/link";
import ContextMenu from "@/components/server/contextMenu"
import { EditableFiles } from "@/lib/types";


export default function ButtonFiles(
    { icon, text, path, onClick, id }:
        { icon: ReactNode; text: string, path: string, onClick?: (e: React.MouseEvent) => (void) , id: string}
) {
    const [contextMenu, setContextMenu] = useState<ReactNode | null>(null);

    if (!onClick) {
        onClick = () => {
            // get extension from path
            const extension = path.split('.').pop();
            if (extension && EditableFiles.includes(extension)) {
                // from url redirect to location.pathname+"/edit?path=${path}"
                window.location.href = location.pathname + `/editor?path=` + path;
            }
        }
    }
    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        setContextMenu(<ContextMenu position={[e.pageX, e.pageY]} file={path} id={id} />);

        // Agrega un event listener para cerrar el menú cuando se hace clic fuera de él
        window.addEventListener('mousedown', handleOutsideClick);
    };

    const handleOutsideClick = (e: Event) => {
        const menu = document.getElementById('menu');
        // Si se hizo clic fuera del menú, cierra el menú y remueve el event listener
        if (menu && !menu.contains(e.target as Node)) {
            setContextMenu(null);
            window.removeEventListener('mousedown', handleOutsideClick);
        }
    };


    return (
        <>
            <button className="hover:bg-gray-200 rounded-lg px-4 py-2 flex"
                onContextMenu={handleContextMenu}
                onClick={onClick}
            >
                {icon} {text}
            </button>
            {contextMenu}
        </>
    );
}
