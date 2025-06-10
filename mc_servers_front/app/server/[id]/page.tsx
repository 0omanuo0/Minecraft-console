"use client";

import React, { useEffect, useState } from "react";

import { McServer } from "@/lib/types";
import { useParams } from 'next/navigation';
import HeadServer   from "@/components/server/head";
import Console      from "@/components/server/server_pages/console";
import ConfigServer from "@/components/server/server_pages/config";
import Files        from "@/components/server/server_pages/files/files";



export default function Servers() {
    const params = useParams<{ id: string }>();

    const [server, setServer] = useState<null | McServer>(null);
    const [sectionSelected, setSectionSelected] = useState<string>("console");
    const [section, setSection] = useState<React.ReactNode>(null);

    useEffect(() => {
        const fetchServer = async () => {
            const response = await fetch(`/api/server/${params.id}`);
            const data = await response.json();
            setServer(data);
        };
        fetchServer();

        setInterval(async () => {
            fetchServer();
        }, 5000);
    }, [params.id]);

        useEffect(() => {
        window.scrollTo(0, document.body.scrollHeight);
    }, []);


    useEffect(() => {
        if (server) {
            switch (sectionSelected) {
                case "console":
                    setSection(<Console params={params} />);
                    break;
                case "config":
                    setSection(<ConfigServer params={params} server={server} />);
                    break;
                case "files":
                    setSection(<Files params={params} />);
                    break;
                default:
                    setSection(<Console params={params} />);
                    break;
            }
        }
    }, [server, sectionSelected]);



    return (
        <>
            <HeadServer id={params.id} server={server} setSelection={setSectionSelected} selection={sectionSelected} />
            {section}
        </>
    )

}