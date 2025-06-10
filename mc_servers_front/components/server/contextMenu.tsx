import { File } from "buffer";
import { useParams } from "next/navigation";
import React, { useEffect } from "react";
import { FilesContext } from "./server_pages/files/files";
import { toast } from "react-toastify";


enum ContextMenuOptions {
    DELETE = "delete",
    RENAME = "rename",
    FILE = "file",
    FOLDER = "folder",
    UPLOAD = "upload",
    DOWNLOAD = "download",
    UNZIP = "unzip"
}

const isFile = (path: string) => {
    return path.split(".").pop() === path ? undefined : path.split('.').pop();
};

const isZipFile = (path: string) => {
    return path.split(".").pop() === "zip";
}

async function downloadFile(file: string) {
    try {
        const response = await fetch(file);
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = !isFile(file) ? (file.split('/').pop() || 'download') + '.zip' : file.split('/').pop() || 'download';
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Download failed:", error);
    }
}

async function deleteFile(file: string) {
    try {
        const response = await fetch(file, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error("Failed to delete file");
        }
        return await response.json();
    } catch (error) {
        console.error("Delete failed:", error);
        throw error;
    }
}

async function renameFile(file: string, newName: string) {
    try {
        const response = await fetch(file, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "newName": newName }),
        });
        if (!response.ok) {
            throw new Error("Failed to rename file");
        }
        return await response.json();
    } catch (error) {
        console.error("Rename failed:", error);
        throw error;
    }
}

async function createFile(file: string, fileName: string) {
    try {
        const response = await fetch(file, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ "newName": fileName }),
        });
        if (!response.ok) {
            throw new Error("Failed to create file");
        }
        return await response.json();
    } catch (error) {
        console.error("Create file failed:", error);
        throw error;
    }
}

async function uploadFile(file: string, fileData: any) {
    try {
        const formData = new FormData();
        formData.append('file', fileData);
        const response = await fetch(file, {
            method: 'POST',
            body: formData,
        });
        if (!response.ok) {
            throw new Error("Failed to upload file");
        }
        return await response.json();
    } catch (error) {
        console.error("Upload failed:", error);
        throw error;
    }
}

export default function ContextMenu({ file, position, enableDelete = true }: { file: string; position: [number, number]; enableDelete: boolean }) {
    const params = useParams<{ id: string }>();

    const { fetchData } = React.useContext<any>(FilesContext);

    const contextCommand = async (e: React.MouseEvent, file: string) => {
        e.preventDefault();
        e.stopPropagation();


        switch (e.currentTarget.id) {
            case ContextMenuOptions.UNZIP:
                const unzip = fetch(`/api/server/${params.id}/file/unzip?f=${encodeURIComponent(file)}`, {
                    method: 'POST',
                });
                toast.promise(unzip, {
                    pending: "Unzipping...",
                    success: "File unzipped successfully",
                    error: "Failed to unzip file"
                });
                break;
            case ContextMenuOptions.DOWNLOAD:
                const down = downloadFile(`/api/server/${params.id}/file/download?f=${encodeURIComponent(file)}`);
                toast.promise(down, {
                    pending: "Downloading...",
                    success: "File downloaded successfully",
                    error: "Failed to download file"
                });
                break;

            case ContextMenuOptions.DELETE:
                if (confirm(`Are you sure you want to delete ${file}?`)) {
                    const del = deleteFile(`/api/server/${params.id}/file/delete?f=${encodeURIComponent(file)}`);
                    toast.promise(del, {
                        pending: "Deleting...",
                        success: "File deleted successfully",
                        error: "Failed to delete file"
                    });
                }
                break;

            case ContextMenuOptions.RENAME:
                const newName = prompt("Enter new name for the file:", file);
                if (newName && newName.trim() !== "") {
                    const ren = renameFile(`/api/server/${params.id}/file/rename?f=${encodeURIComponent(file)}`, newName);
                    toast.promise(ren, {
                        pending: "Renaming...",
                        success: "File renamed successfully",
                        error: "Failed to rename file"
                    });
                }
                break;

            case ContextMenuOptions.FILE:
                const fileName = prompt("Enter name for the new file:");
                if (fileName && fileName.trim() !== "") {
                    const create = createFile(`/api/server/${params.id}/file/newFile?f=${encodeURIComponent(file)}`, fileName);
                    toast.promise(create, {
                        pending: "Creating...",
                        success: "File created successfully",
                        error: "Failed to create file"
                    });
                }
                break;

            case ContextMenuOptions.FOLDER:
                const folderName = prompt("Enter name for the new folder:");
                if (folderName && folderName.trim() !== "") {
                    const create = createFile(`/api/server/${params.id}/file/newFolder?f=${encodeURIComponent(file)}`, folderName);
                    toast.promise(create, {
                        pending: "Creating...",
                        success: "Folder created successfully",
                        error: "Failed to create folder"
                    });
                }
                break;

            case ContextMenuOptions.UPLOAD:
                const upload = new Promise<void>((resolve, reject) => {
                    const input = document.createElement("input");
                    input.type = "file";
                    input.multiple = true;

                    input.onchange = async (event: any) => {
                        try {
                            const files = Array.from(event.target.files as FileList);
                            if (files.length) {
                                const uploads = files.map((fileSend: any) =>
                                    uploadFile(`/api/server/${params.id}/file/upload?f=${encodeURIComponent(file)}`, fileSend)
                                );
                                await Promise.all(uploads);
                            }
                            resolve();      // notify that uploads are done
                        } catch (err) {
                            reject(err);     // forward any upload errors
                        }
                    };

                    input.click();
                });
                toast.promise(upload, {
                    pending: "Uploading...",
                    success: "Files uploaded successfully",
                    error: {
                        render({ data }: any) {
                            return "Failed to upload files: " + data.message;
                        }
                    }
                });
                break;

            default:
                break;
        }

        fetchData(params.id);
    }

    // move menu to mouse position when useEffect is called
    useEffect(() => {
        const menu = document.getElementById('menu');
        if (menu) {
            menu.style.left = `${position[0]}px`;
            menu.style.top = `${position[1]}px`;
        }

    }, [position]);


    return (
        <div id="menu" className="absolute bg-white rounded-lg shadow-lg py-2">
            <ul id="list_menu" className=" space-y-2">
                <li key={"download"} > <button onClick={(e) => { contextCommand(e, file) }} id={"download"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Download   </button> </li>

                {
                    enableDelete &&
                    <li key={"delete"} > <button onClick={(e) => { contextCommand(e, file) }} id={"delete"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hovers:text-neutral-600" >Delete          </button> </li>
                }
                {
                    isZipFile(file) ?
                        <li key={"unzip"} > <button onClick={(e) => { contextCommand(e, file) }} id={"unzip"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Unzip</button> </li>
                        : null
                }

                <li key={"rename"} > <button onClick={(e) => { contextCommand(e, file) }} id={"rename"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Rename         </button> </li>
                {
                    !isFile(file) ?
                        <>
                            <li key={"file"} >   <button onClick={(e) => { contextCommand(e, file) }} id={"file"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Create file        </button> </li>
                            <li key={"folder"} > <button onClick={(e) => { contextCommand(e, file) }} id={"folder"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Create folder  </button> </li>
                            <li key={"upload"} > <button onClick={(e) => { contextCommand(e, file) }} id={"upload"} className=" w-full text-left px-4 py-1 hover:bg-slate-100 hover:text-neutral-600" >Upload         </button> </li>
                        </> :
                        null
                }

            </ul>
        </div>
    )
}