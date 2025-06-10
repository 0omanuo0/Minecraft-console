"use server";
import { Inter } from 'next/font/google';
import Sidebar from '@/components/sidebar';
import { getServers } from '@/lib/get_server_data';

import ToastNotify from '@/components/toastNotify';

import { Metadata } from 'next';
import { DashboardProvider } from './dashboardContext';

const inter = Inter({ subsets: ['latin'] });

const metadata: Metadata = {
    title: 'Dashboard',
};


export default async function DashboardLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}) {
    // In Next.js 15, route params arrive as a Promise and must be awaited
    const { id } = await params;

    const serversList = await getServers();

    return (
        <html lang="en">
            <head>
                {/* Still include Bootstrap Icons if you need them */}
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.8.0/font/bootstrap-icons.css"
                    media="all"
                />
            </head>
            <body className={`${inter.className} bg-[#2E4F4F]`}>
                <ToastNotify />
                <DashboardProvider data={{ serversList }}>
                    <div>
                        <Sidebar />
                        <main className="space-y-8 mt-10 ml-[21rem] mr-10 pb-32">
                            {children}
                        </main>
                    </div>
                </DashboardProvider>
            </body>
        </html>
    );
}
