"use server";
import { McServer, McServerList, Files } from "@/lib/types"
import { unstable_noStore as noStore } from 'next/cache';

const api_ip = process.env.SERVER_API_IP;

export async function sendConfig(formData: FormData, id: string) {
    "use server";
    console.log("formdata", formData);

    const config_options: { [key in string]: any } = require('@/data/server_properties.json');
    const formData2 = formData;
    // compare formdata with config_options, if dont exists in formdata, add to formdata
    Object.keys(config_options).forEach((key) => {
        if (!formData2.has(key)) {
            switch (typeof config_options[key]) {
                case 'boolean':
                    formData2.append(key, "off");
                    break;
                case 'number':
                    formData2.append(key, config_options[key]);
                    break;
                case 'object':
                case 'string':
                    formData2.append(key, "");
                    break;
                default:
            }
        }
    });
    console.log("formdata2", formData2);

    noStore();
    fetch(`${api_ip}/server/${id}/config`, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export async function editFile(formData: FormData, id: string, path: string) {
    "use server";

    let data: { [key in string]: any } = {};
    formData.forEach((value, key) => {
        data[key] = value;
    });

    console.log(data);

    noStore();
    fetch(`${api_ip}/server/${id}/edit?path=${path}`, {
        method: 'POST',
        body: formData,
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}


export async function start(id: string) {
    "use server";
    noStore();
    fetch(`${api_ip}/server/${id}/start`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export async function stop(id: string) {
    "use server";
    noStore();
    fetch(`${api_ip}/server/${id}/stop`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export async function create() {
    "use server";
    fetch(`${api_ip}/server`, {
        method: 'POST',
    })
        .then(response => response.json())
        .then(data => {
            console.log('Success:', data);
        })
        .catch((error) => {
            console.error('Error:', error);
        });
}

export async function createFolder(id: string, folder: string, path: string) : Promise<{[key in string]: any}> {
    "use server";

    noStore();
    try {
        // post
        const response = await fetch(`${api_ip}/server/${id}/folder?folder=${folder}&path=${path}`, {
            method: 'POST',
        });
        const data = await response.json();
        return data;
    }
    catch (error) {
        return { error: error };
    }
    
}