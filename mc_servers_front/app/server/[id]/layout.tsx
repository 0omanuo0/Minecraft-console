import type { Metadata } from "next";
import { Inter } from "next/font/google";

import Sidebar from "@/components/sidebar";
import HeadServer from "@/components/server/head";

import ToastNotify from "@/components/toastNotify";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Server Dashboard",
    description: "Generated by create next app",
};

export default function Layout({
    children, params,
}: Readonly<{
    children: React.ReactNode; params: { id: string }
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css" media="all" />
            </head>
            <body className={inter.className + " bg-[#2E4F4F]"}>
                <ToastNotify />
                <div className="">
                    <Sidebar />
                    <main className="space-y-8 mt-10 ml-[21rem] mr-10 mb-16">
                        <HeadServer id={params.id} />
                        {children}
                    </main>
                </div>
            </body>
        </html>
    );
}
