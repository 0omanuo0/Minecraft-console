import {Server, States, McServerList} from "@/lib/types"


export const server : Server = {
    host : "localhost",
    SO : "Ubuntu 22.04 focal",
    cpu : {
        name : "Intel Core i7-11800H",
        cores : 8,
        cpuUsage : 0.5
    },
    ram : {
        usage : 0.33,
        available : 32000000
    }
}


// generate id with random string
export const generateId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export const serversList : McServerList = [
    {
        name : "server1",
        host: "10.1.1.1",
        status: States.Online,
        id : "clffalsxwe500lxihfund5ch",
        process_status:{
            PID : 123,
            CPU : 0.5,
            RAM : 0.33,
            CMD : "java -jar server.jar"
        }
    },
    {
        name : "server2",
        status: States.Idle,
        host: "localhost",
        id : "lcwi8jltboku9k2vh7i4n",
        process_status:{
            PID : 0,
            CPU : 0.5,
            RAM : 0.33,
            CMD : "java -jar server.jar"
        }
    },
    {
        name : "server3",
        status: States.Offline,
        host: "localhost",
        id : "asya7u0m6z757t3mvjx8d",
        process_status:{
            PID : 0,
            CPU : 0.5,
            RAM : 0.33,
            CMD : "java -jar server.jar"
        }
    }
]