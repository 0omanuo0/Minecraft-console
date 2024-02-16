import StateSidebar from "@/components/statesSidebar";
import type { McServerList } from "@/lib/types";
import Link from "next/link";

export default function ServerList({ serversList, }: Readonly<{ serversList: McServerList|undefined; }>) {
    if (!serversList) {
        return <></>;
    }
    const servers = serversList.map((server, index) => {
        return (
            <li key={index} className=" pl-6 text-neutral-600 ">
                <Link href={`/server/${server.id}`}>
                    {server.name}
                    <StateSidebar state={server.status}></StateSidebar>
                </Link>
            </li>
        )
    });
    return (


        <section className=" bg-neutral-100 rounded-lg px-20 py-10 space-y-4">
            <div className=" border-b-2 text-black">
                <h1>Servers</h1>
            </div>
            <ul>
                {servers}
            </ul>
        </section>
    );
}