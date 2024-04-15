import { Server } from "@/lib/types";

export default function Status({data,} : Readonly<{data:Server;}>) {
    return (
        <section className=" bg-neutral-100 rounded-lg px-20 py-10 space-y-4">

            <div className="flex border-b-2 pb-4 text-black">
                <h1 className="text-2xl">Dashboard</h1>
            </div>
            <ul className="grid grid-cols-3 grid-flow-row gap-1 text-neutral-600">
                <li>Host: <span>{ data.host }</span></li>
                <li>SO: <span>{ data.SO }</span></li>
                <li>CPU cores: <span>{ data.cpu.cores + "(" + data.cpu.name + ")" }</span></li>
                <li>CPU usage: <span>{ data.cpu.cpuUsage*100 }%</span></li>
                <li>RAM usage: <span>{ data.ram.usage }%</span></li>
                <li>RAM available: <span>{(data.ram.available / 1024 ** 3).toFixed(2)}GB</span></li>
            </ul>
        </section>
    )
}