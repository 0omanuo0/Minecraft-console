
import ListFiles from "./fileList";
import Head from "./filesHead";
import { Suspense } from "react";
import { getServerFiles } from "@/lib/get_server_data";


export default async function Servers({ params }: { params: { id: string } }) {
    const data = await getServerFiles(params.id);
    if (!data) return <></>;
    return (
        <section className=" bg-neutral-100 rounded-lg text-neutral-600 p-10">
            <Head id={params.id} route={data.rute} />
            <div className="">
                <Suspense fallback={<div>Loading...</div>}>
                    <ListFiles files={data} id={params.id}></ListFiles>
                </Suspense>
            </div>
        </section>
    );
}

