"use client";

import { useEffect } from "react";
import { toast } from "react-toastify";

export default async function Servers({ searchParams }: { searchParams: { success: string } }) {
    useEffect(() => {
        if (searchParams.success === "true") {
            toast.success("Server created successfully");
        }
        else if (searchParams.success === "false") {
            toast.error("Server creation failed");
        }
    }, []);
    return (
        <>

        </>
    )

}