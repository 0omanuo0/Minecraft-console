

import { unstable_noStore as noStore } from 'next/cache';
import { getFileEdit } from "@/lib/get_server_data"
import EditorSection from "./fileEditor"

function getFileType(path: string) {
    const split = path.split(".");
    return split[split.length - 1];
}

export default async function Servers({ params, searchParams }:
    { params: { id: string }; searchParams: { path: string } }
) {

    noStore();
    const content = await getFileEdit(params.id, searchParams.path);
    if (!content) return <></>;
    const fileType = getFileType(searchParams.path);
    return (
        <section className="space-y-4 rounded-xl pb-10">
            <EditorSection fileType={fileType} content={content} id={params.id} path={searchParams.path}></EditorSection>
        </section>
    );
}