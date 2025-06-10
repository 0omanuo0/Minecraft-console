"use client";

import { Metadata } from "next";
import { useContext, useEffect } from "react";
import { toast } from "react-toastify";

import Status from '@/components/dashboard/server_status';
import ServerList from '@/components/dashboard/server_list';
import ServerListSkeleton from '@/components/dashboard/skeletons/server_list_skeleton';
import { Suspense } from 'react';
import { server } from '@/temp_data';
import { dashboardContext } from './dashboardContext';




export default function Servers() {

    const { serversList } = useContext(dashboardContext);

    return (
        <>
            <Status data={server} />
            <Suspense fallback={<ServerListSkeleton />}>
                <ServerList serversList={serversList} />
            </Suspense>
        </>
    )

}