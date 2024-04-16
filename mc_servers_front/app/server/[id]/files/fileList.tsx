"use client";
import { Files } from "@/lib/types";
import ButtonFiles from "./buttonFiles";
import { ReactNode, use, useEffect, useState } from "react";
import {
    FolderIcon,
    AdjustmentsHorizontalIcon,
    CommandLineIcon,
    ChatBubbleBottomCenterTextIcon,
    DocumentTextIcon,
    DocumentIcon,
    CodeBracketIcon,
    ArchiveBoxIcon,
    ArrowLongLeftIcon
} from '@heroicons/react/24/outline';
import { set } from "zod";


const icons: { [key in string]: ReactNode } = {
    "properties": <AdjustmentsHorizontalIcon className="w-6 mr-2"></AdjustmentsHorizontalIcon>,
    "json": <CodeBracketIcon className="w-6 mr-2"></CodeBracketIcon>,
    "jar": <CommandLineIcon className="w-6 mr-2"></CommandLineIcon>,
    "log": <ChatBubbleBottomCenterTextIcon className="w-6 mr-2"></ChatBubbleBottomCenterTextIcon>,
    "txt": <DocumentTextIcon className="w-6 mr-2"></DocumentTextIcon>,
    "zip": <ArchiveBoxIcon className="w-6 mr-2"></ArchiveBoxIcon>
}


function isFile(file: string) {
    var match = file.match(/\.[^.]+$/);
    return match ? match[0].substring(1) : undefined;
}




export default function ListFiles({ id, files }: Readonly<{ id: string; files: Files }>) {

    const [folder, setFolder] = useState([<></>]);
    const [back, setBack] = useState<(Files)[]>([files]);

    useEffect(() => {
        if (!files) setFolder([<></>]);
        setFolder(createList(files, id));
    }, []);

    return (
        <div>
            {
                back.length > 1 ?
                    <button
                        onClick={() => {
                           // remove the last element from the list and createList()
                            back.pop();
                            setFolder(createList(back[back.length - 1], id));
                        }}
                        className="hover:bg-gray-200 rounded-lg px-4 py-2 flex mb-2"
                    >
                        <ArrowLongLeftIcon className="w-6 mr-2"></ArrowLongLeftIcon>Back
                    </button>
                    : <></>}
            <ul className="ml-4 space-y-2 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
                {folder}
            </ul>
        </div>
    )


    function Directory({ files_dir,id }: { files_dir: Files;id: string;}) {
        if (!files_dir) return <></>;
        const icon = <FolderIcon className="w-6 mr-2" />;

        return (
            <li key={files_dir.rute + files_dir.name}>
                <ButtonFiles
                    id={id}
                    icon={icon} text={files_dir.name} path={files_dir.rute}
                    onClick={() => setFolder(createList(files_dir, id))}
                ></ButtonFiles>
            </li>
        )
    }

    function createList(
        files_dir: Files,
        id: string,
    ) {
        const a = back;
        // ckeck if the last element is the same as the current
        if (a[a.length - 1] !== files_dir) {
            a.push(files_dir);
        }
        setBack(a);
        console.log(back);

        const file = files_dir.files.map((element) => {
            const extension = isFile(element);
            let icon: ReactNode;

            if (!extension) icon = <></>;
            else icon = icons[extension];

            if (!icon) icon = <DocumentIcon className="w-6 mr-2"></DocumentIcon>;

            return (
                <li key={element}>
                    <ButtonFiles id={id} icon={icon} text={element} path={files_dir.rute + "/" + element}></ButtonFiles>
                </li>
            )
        });
        const dirs = files_dir.dir.map((element) => {
            return <Directory id={id} files_dir={element}></Directory>
        });
        return [...dirs, ...file];
    }
}


