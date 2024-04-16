"use client";

// import heroicons for create, upload and download icons
import { ArrowUpTrayIcon, ArrowDownTrayIcon, FolderPlusIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { FormEvent, useState } from 'react';
import { toast } from 'react-toastify';

export default function Head({ id, route }: Readonly<{ id: string; route: string }>) {
    const [folderDialog, setfolderDialog] = useState(<></>)

    return (
        <div className="flex mb-10 border-b-2 pb-6 px-10">
            {folderDialog}
            <div>
                <h1 className="text-2xl text-black">Files</h1>
                <p className="text-neutral-800 font-extralight">Manage your server files</p>
            </div>
            <nav className="flex space-x-6 relative lg:flex ml-auto items-center">
                <button className=" hover:animate-spin text-black" onClick={()=> window.location.reload() }>
                    <ArrowPathIcon className="w-6"></ArrowPathIcon>
                </button>
                <button
                    className="p-3 h-fit bg-white rounded-xl shadow-xl hover:bg-gray-200 transition-colors ease-in-out duration-300"
                    onClick={
                        () => {
                            // open dialog to create folder
                            // <CreateFolderDialog></CreateFolderDialog>
                            setfolderDialog(<CreateFolderDialog></CreateFolderDialog>)
                        }
                    }
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

    function CreateFolderDialog() {
        return (

            <div
                className="fixed inset-0 last:bg-black/50 z-50 flex items-center justify-center pop-up"
                onClick={
                    () => {
                        setfolderDialog(<></>)
                    }
                }
            >

                <form
                    className="bg-gray-100 rounded-lg py-6 p-8 shadow-2xl"
                    onSubmit={
                        (e: FormEvent) => {
                            e.preventDefault();
                            const folder_name = (document.getElementById('folder_name') as HTMLInputElement).value;
                            // fetch /api/server/:id/files/create_folder?name=folder_name&path=route
                            fetch(`/api/server/${id}/files/create_folder?folder=${folder_name}&path=${route}`)
                                .then(async response => {
                                    if (response.ok) {
                                        toast.success("Folder created" + response.body);
                                        // wait 1s and reload page
                                        await new Promise(resolve => setTimeout(resolve, 1000));
                                        window.location.reload();
                                    }
                                    else {
                                        // from the response.json() get the object.error
                                        const error = await response.json();
                                        toast.error("Error creating folder: " + error.error);
                                    }
                                    setfolderDialog(<></>);
                                })
                                .catch(async error => {
                                    toast.error("Error creating folder" + await error);
                                    setfolderDialog(<></>);
                                })


                        }
                    }
                    onClick={(e) => { e.stopPropagation() }}
                >
                    <h1 className="text-2xl text-black animate-pulse">Create Folder</h1>
                    <input
                        key={Math.random()}
                        id='folder_name'
                        type="text"
                        className="w-full border-b-2 border-neutral-200 focus:outline-none mt-4 p-2 rounded-lg shadow-xl focus:border-[#6cabad]"
                        placeholder="Folder name"
                    ></input>
                    <div className="flex justify-end mt-4">
                        <button
                            className="px-4 py-2 bg-[#6cabad] hover:bg-[#0E8388] duration-300 transition-colors text-white rounded-lg shadow-xl"
                            type="submit"
                        >
                            Create
                        </button>
                    </div>
                </form>
            </div>
        )
    }
}


