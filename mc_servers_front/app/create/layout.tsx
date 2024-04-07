import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Sidebar from "@/components/sidebar";
import { notFound, redirect } from "next/navigation";
import { getServers } from "@/lib/get_server_data"


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Create Server",
    description: "Generated by create next app",
};

export default async function DashboardLayout({
    children, params,
}: Readonly<{
    children: React.ReactNode; params: { id: string }
}>) {
    const serversList = await getServers();
    // redirect dashboard if !serversList
    if(!serversList) redirect("/dashboard");
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css" media="all" />
            </head>
            <body className={inter.className + " bg-[#2E4F4F]"}>
                <div className="">
                    <Sidebar serversList={serversList}></Sidebar>
                    {children}
                    
                </div>
            </body>
        </html>
    );
}