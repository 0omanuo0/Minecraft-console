// create type enum states
export enum States {
    Online = "online",
    Offline = "offline",
    Idle = "idle",
}

export const EditableFiles = [
    "log",
    "txt",
    "properties",
    "json",
];

export interface Files{
    dir:Files[],
    files:string[],
    rute:string,
    name:string,
}

interface Section{
    name:string,
    Path:string
}
export type SectionsObj = {
    [key in string]: Section
}
// key string and value number, boolean, string or Object
export type Config = {
    [key in string]: number|boolean|string
}

// host, cpu, cores, cpu usage, ram usage, ram available

export interface McServer {
    name : string,
    host: string,
    status : States,
    id : string,
    config?: Config,
    process_status:{
        PID : number,
        CPU : number,
        RAM : number,
        CMD : string,
    }
}

export type McServerList = McServer[];

export interface Server {
    host : string,
    SO : string,
    cpu : {
        name: string,
        cores : number,
        cpuUsage : number
    }
    ram : {
        usage : number,
        available : number
    }
}
