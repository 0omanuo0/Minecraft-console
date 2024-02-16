import { McServer, McServerList } from "@/lib/types"
import { unstable_noStore as noStore } from 'next/cache';

const api_ip = process.env.SERVER_API_IP;

export async function getServers() {
    try {
        noStore();
        const res = await fetch(`${api_ip}/servers`);
        
        if (!res.ok) {
            return undefined;
        }

        const data = await res.json();
        const servers : McServerList = data.servers;

        return servers;
    } catch (error) {
        console.error('Error al obtener los servidores:', error);
        throw error; // Puedes manejar el error según tus necesidades
    }
}

export async function getServer(id:string) {
    try {
        noStore();
        const res = await fetch(api_ip + `/server/` + id);
        if (!res.ok) {
            return undefined;
        }

        const data = await res.json();
        const server : McServer = data;

        return server;
    } catch (error) {
        console.error('Error al obtener los servidores:', error);
        throw error; // Puedes manejar el error según tus necesidades
    }
}

export async function getFileEdit(id:string, path:string) {
    try {
        const api_ip = process.env.SERVER_API_IP;
        noStore();
        const url = api_ip + `/server/` + id + "/edit?path=" + path;
        const res = await fetch(url);
        console.log("Api ip: " + api_ip)
        if (!res.ok) {
            return undefined;
        }
        
        const data : {[key in string]: string} = await res.json();
        
        const server : string = data.content;
        
        return server;
        
    } catch (error) {
        console.error('Error al obtener los servidores:', error);
        throw error; // Puedes manejar el error según tus necesidades
    }
}