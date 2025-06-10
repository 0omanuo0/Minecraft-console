

import { unstable_noStore as noStore } from 'next/cache';
import { getFileEdit } from "@/lib/get_server_data"
import EditorSection from "./fileEditor"

function getFileType(path: string) {
    const split = path.split(".");
    return split[split.length - 1];
}

export default async function Servers({ params, searchParams }:
    { params: Promise<{ id: string }>; searchParams: Promise<{ path: string }> }
) {
    const { id } = await params;
    const { path } = await searchParams;

    noStore();
    const content = await getFileEdit(id, path);
    console.log("content", content);
    if (content === undefined) return <></>;
    const fileType = getFileType(path);
    return (
        <section className="space-y-4 rounded-xl pb-10">
            <EditorSection fileType={fileType} content={content} id={id} path={path}></EditorSection>
        </section>
    );
}