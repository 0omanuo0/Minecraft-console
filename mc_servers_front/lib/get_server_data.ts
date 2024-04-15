import { McServer, McServerList, Files } from "@/lib/types"
import { unstable_noStore as noStore } from 'next/cache';

export const api_ip = process.env.SERVER_API_IP;

export async function getServers() {
    noStore();
    try {
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
    noStore();
    try {
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
    noStore();
    try {
        const api_ip = process.env.SERVER_API_IP;
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

export async function getServerFiles(id:string, path?:string) {
    noStore();
    try {
        const api_ip = process.env.SERVER_API_IP;
        const url = `${api_ip}/server/${id}/files`;
        
        const res = await fetch(url);
        if (!res.ok) return undefined;
        
        const data : Files = await res.json();
        return data;
    } catch (error) {
        console.error('Error al obtener los servidores:', error);
        throw error; // Puedes manejar el error según tus necesidades
    }
}
