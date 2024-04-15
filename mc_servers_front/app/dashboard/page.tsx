import Sidebar from "@/components/sidebar"
import Status from "@/components/dashboard/server_status"
import ServerList from "@/components/dashboard/server_list"
import ServerListSkeleton from "@/components/dashboard/skeletons/server_list_skeleton"
import { server } from "@/temp_data"
import { Suspense } from "react"
import { getServers } from "@/lib/get_server_data"


export default async function Servers() {
    const serversList = await getServers();
    return (
        <div className="">
            <main className="space-y-8 mt-10 ml-[21rem] mr-10 pb-32">
                <Status data={server}></Status>
                <Suspense fallback={<ServerListSkeleton/>}>
                    <ServerList serversList={serversList}></ServerList>
                </Suspense>

            </main>
        </div>
    )

}