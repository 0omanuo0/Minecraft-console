"use client";

// import heroicons for create, upload and download icons
import { ArrowUpTrayIcon, ArrowDownTrayIcon, FolderPlusIcon } from '@heroicons/react/24/outline';

export default function Head({ id, route }: Readonly<{ id: string; route: string }>) {

    return (
        <div className="flex mb-10 border-b-2 pb-6 px-10">
            <div>
                <h1 className="text-2xl text-black">Files</h1>
                <p className="text-neutral-800 font-extralight">Manage your server files</p>
            </div>
            <nav className="flex space-x-6 relative lg:flex ml-auto items-center">
                <button
                    className="px-3 py-3 h-fit bg-white rounded-xl shadow-xl hover:bg-gray-200 transition-colors ease-in-out duration-300"
                >
                    <FolderPlusIcon className="w-6"></FolderPlusIcon>
                </button>
                <button
                    className="px-3 py-3 h-fit bg-white rounded-xl shadow-xl hover:bg-gray-200 transition-colors ease-in-out duration-300"
                >
                    <ArrowUpTrayIcon className="w-6"></ArrowUpTrayIcon>
                </button>
                <button
                    className="px-3 py-3 h-fit bg-white rounded-xl shadow-xl hover:bg-gray-200 transition-colors ease-in-out duration-300"
                    onClick={() => {
                        const url = `/api/server/${id}/download?f=${route}`;
                        window.open(url);
                    }}
                >
                    <ArrowDownTrayIcon className="w-6"></ArrowDownTrayIcon>
                </button>
            </nav>
        </div>
    )
}
