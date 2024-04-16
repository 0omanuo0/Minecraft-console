import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { notFound } from "next/navigation";

import Sidebar from "@/components/sidebar";
import { getServers } from "@/lib/get_server_data";
import Status from "@/components/dashboard/server_status";
import ServerList from "@/components/dashboard/server_list";
import ServerListSkeleton from "@/components/dashboard/skeletons/server_list_skeleton";

import { Suspense } from "react"
import ToastNotify from "@/components/toastNotify";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Dashboard",
    description: "Generated by create next app",
};

export default async function DashboardLayout({
    children, params,
}: Readonly<{
    children: React.ReactNode; params: { id: string }
}>) {

    let serversList = await getServers();

    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css" media="all" />
            </head>
            <body className={inter.className + " bg-[#2E4F4F]"}>
                <ToastNotify />
                <div className="">
                    <Sidebar />
                    <div className="">
                        <main className="space-y-8 mt-10 ml-[21rem] mr-10 pb-32">
                            <Status ></Status>
                            <Suspense fallback={<ServerListSkeleton />}>
                                <ServerList serversList={serversList}></ServerList>
                            </Suspense>
                            {children}
                        </main>
                    </div>
                </div>
            </body>
        </html>
    );
}
