"use client";
import { Files } from "@/lib/types";
import ButtonFiles from "./buttonFiles";
import { ReactNode, useState } from "react";
import {
    FolderIcon,
    AdjustmentsHorizontalIcon,
    CommandLineIcon,
    ChatBubbleBottomCenterTextIcon,
    DocumentTextIcon,
    DocumentIcon,
    CodeBracketIcon
} from '@heroicons/react/24/outline';


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

export default function ListFiles({ id, files }: Readonly<{ id: string; files: Files }>) {
    const dirs = files.dir.map((element) => {
        return <Directory id={id} files={element}></Directory>
    })
    const file = files.files.map((element) => {
        const extension = isFile(element);
        let icon: ReactNode;

        if (!extension) icon = <></>;
        else icon = icons[extension];

        if(!icon) icon = <DocumentIcon className="w-6 mr-2"></DocumentIcon>;

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
    if (!files) return <></>;
    const icon = <FolderIcon className="w-6 mr-2" />;
    return (
        <li key={files.rute + files.name}>
            <ButtonFiles
                icon={icon} text={files.name} path={files.rute}
                onClick={() => toggleExpanded(!isExpanded)}
            ></ButtonFiles>
            {
                isExpanded && <ListFiles id={id} files={files} />
            }
        </li>
    )

}
