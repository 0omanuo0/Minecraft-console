import { McServer, McServerList, Files } from "@/lib/types"
import { unstable_noStore as noStore } from 'next/cache';

export const api_ip = process.env.SERVER_API_IP;

export function sendConfig(id: string, config: any) {
    noStore();
    fetch(`${api_ip}/server/${id}/config`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}