"use client";
import { Files } from "@/lib/types";
import ButtonFiles from "./buttonFiles";
import { ReactNode, use, useContext, useEffect, useState } from "react";
import {
    FolderIcon,
    AdjustmentsHorizontalIcon,
    CommandLineIcon,
    ChatBubbleBottomCenterTextIcon,
    DocumentTextIcon,
    DocumentIcon,
    CodeBracketIcon,
    ArrowPathIcon
} from '@heroicons/react/24/outline';
import { getServerFiles } from "@/lib/get_server_data";
import ContextMenu from "../../contextMenu";
import { FilesContext } from "./files";


const icons: { [key in string]: ReactNode } = {
    "properties": <AdjustmentsHorizontalIcon className="w-6 mr-2"></AdjustmentsHorizontalIcon>,
    "json": <CodeBracketIcon className="w-6 mr-2"></CodeBracketIcon>,
    "jar": <CommandLineIcon className="w-6 mr-2"></CommandLineIcon>,
    "log": <ChatBubbleBottomCenterTextIcon className="w-6 mr-2"></ChatBubbleBottomCenterTextIcon>,
    "txt": <DocumentTextIcon className="w-6 mr-2"></DocumentTextIcon>,
}


function isFile(file: string) {
    var match = file.match(/\.[^.]+$/);
    return match ? match[0].substring(1) : undefined;
}

export default function ListFiles({ id }: Readonly<{ id: string }>) {

    const [files, setFiles] = useState<Files | null | undefined>(undefined);
    const [contextmenu, setContextMenu] = useState<ReactNode | null>(null);

    const { fetchData } = useContext(FilesContext);

    const fetchData2 = async () => {
        const response = await fetch(`/api/server/${id}/files`);
        const data = await response.json();
        setFiles(data);
    };

    useEffect(() => {
        fetchData2();
    }, [id]);

    if (files === null) return <p className="text-red-500">Error loading files</p>;
    if (files === undefined) return <p className="text-gray-500">Loading files...</p>;

    return (
        <FilesContext.Provider value={{
            fetchData: async (id: string) => {
                const response = await fetch(`/api/server/${id}/files`);
                setFiles(null); // Reset files to show loading state
                if (!response) return;

                const data = await response.json();
                setFiles(data);
            },
            files: files,
            setFiles: setFiles
        }}>
            <button
                onClick={() => fetchData2()}
                className="-m-4 text-black p-2 hover:scale-110 transition-transform duration-300"
            ><ArrowPathIcon className="w-6" /></button>
            <div
                onContextMenu={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (contextmenu) {
                        setContextMenu(null);
                        return;
                    }

                    setContextMenu(
                        <ContextMenu
                            enableDelete={false}
                            position={[e.pageX, e.pageY]}
                            file={files.rute}
                        />
                    );
                }}
                onClick={() => setContextMenu(null)}
            >
                {contextmenu}
                <FilesRender files={files} id={id} />
            </div>
        </FilesContext.Provider>
    );
}


function FilesRender({ files, id }: Readonly<{ files: Files; id: string }>) {
    const dirs = files.dir.map((element) => {
        return <Directory key={element.name} id={id} files={element}></Directory>
    })


    const file = files.files.map((element) => {
        const extension = isFile(element);
        let icon: ReactNode;

        if (!extension) icon = <></>;
        else icon = icons[extension];

        if (!icon) icon = <DocumentIcon className="w-6 mr-2"></DocumentIcon>;

        return (
            <li key={element}>
                <ButtonFiles icon={icon} text={element} path={files.rute + "/" + element}></ButtonFiles>
            </li>
        )
    });
    return (
        <ul className="ml-4 space-y-2">

            {dirs}{file}
        </ul>
    )

}


function Directory({ id, files }: Readonly<{ id: string; files: Files }>) {
    const [isExpanded, toggleExpanded] = useState(false);
    const icon = <FolderIcon className="w-6 mr-2" />;
    return (
        <li key={files.rute + files.name}>
            <ButtonFiles
                icon={icon} text={files.name} path={files.rute}
                onClick={() => toggleExpanded(!isExpanded)}
            ></ButtonFiles>
            {
                isExpanded && <FilesRender id={id} files={files} />
            }
        </li>
    )

}
