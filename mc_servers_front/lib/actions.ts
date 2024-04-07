'use server';
import { api_ip }from "@/lib/get_server_data"


export async function createServer(serverData:{[key in string]:any}) {
    // post the server data to 
    try{
        const res = await fetch(`${api_ip}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serverData)
        });
        if (!res.ok) {
            return undefined;
        }
        const data = await res.json();
        return data;
    }
    catch (error) {
        console.error('Error al obtener los servidores:', error);
        throw error; // Puedes manejar el error según tus necesidades
    }
}