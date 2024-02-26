import ListFiles from "./fileList";
import { Suspense } from "react";
import { getServerFiles } from "@/lib/get_server_data";


export default async function Servers({ params }: { params: { id: string } }) {
    const data = await getServerFiles(params.id);
    if(!data) return <></>;
    return (
        <section className="space-y-8 bg-neutral-100 rounded-xl text-neutral-600 p-10">
            <Suspense fallback={<div>Loading...</div>}>
                <ListFiles files={data} id={params.id}></ListFiles>
            </Suspense>
        </section>
    );
}

