// lets import json file  from @/data/server_properties.json
"use client";
import clsx from "clsx";
import exp from "constants";
import { Montserrat } from "next/font/google";
import { Config } from "@/lib/types"


const config_options = require('@/data/server_properties.json');



export default function ConfigOpts({default_values,}:Readonly<{default_values:Config|undefined;}>) {

    if(!default_values) return <></>;

    const config = Object.keys(config_options).map((key, index) => {
        const name = key.charAt(0).toLocaleUpperCase() + key.slice(1)
        switch (typeof config_options[key]) {
            case 'boolean':
                return (
                    <li key={key}>
                        {name}
                        <input type="checkbox" defaultChecked={default_values[key] as boolean} name={key} id={key}
                            className=" ml-2 items-end" />
                    </li>
                )
            case 'number':
                return (
                    <li key={key}>
                        {name}
                        <input type="number" name={key} id={key} defaultValue={default_values[key] as number}
                            className="border rounded bg-neutral-100 border-neutral-900 px-2 p-1 ml-2 items-end" />
                    </li>
                )
            case 'string':
                return (
                    <li key={key}>
                        {name}
                        <input type="text"  name={key} id={key} defaultValue={default_values[key] as string}
                            className="bg-neutral-100 border border-neutral-900 rounded px-2 p-1 ml-2 items-end" />
                    </li>
                )
            default:
                return (
                    <li key={key}>
                        {name}
                        <Options default_vaule={default_values[key] as string} ind={key} list={Object.values(config_options[key])}></Options>
                    </li>
                )
        }
    });

    
    return (
        <ul key={"optList"} className=" text-neutral-600 list-none grid grid-cols-1 lg:grid-cols-2 grid-flow-row gap-3 items-center">
            {config}
        </ul>
    )
}


function Options({ list, ind, default_vaule}: Readonly<{ list: string[][]; ind: string; default_vaule:string}>) {

    const opts = list[0].map((item, index) => {
        return (
            <option style={{fontFamily:"sans-serif"}} key={index}>{item}</option>
        )
    });
    return (
        <select name={ind} id={ind} defaultValue={default_vaule}
            className="bg-neutral-100 border border-neutral-900 rounded px-2 p-1 ml-2 items-end ">
                {opts}
        </select>
    )
}