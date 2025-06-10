// lets import json file  from @/data/server_properties.json
"use client";
import clsx from "clsx";
import exp from "constants";
import { Montserrat } from "next/font/google";
import { Config } from "@/lib/types"


const config_options = require('@/data/server_properties.json');



export default function ConfigOpts({ default_values, }: Readonly<{ default_values: Config | undefined; }>) {

    if (!default_values) return <></>;

    const config = Object.keys(config_options).map((key, index) => {
        const name = key.charAt(0).toLocaleUpperCase() + key.slice(1)
        switch (typeof config_options[key]) {
            case 'boolean':
                return (
                    <li key={key} className="flex justify-between items-center">
                        <span>{name}</span>
                        <input type="checkbox" defaultChecked={default_values[key] as boolean} name={key} id={key}
                            className=" ml-2 items-end" onChange={(e) => {
                                console.log(e.target.checked);
                            }} />
                    </li>
                )
            case 'number':
                return (
                    <li key={key} className="flex justify-between items-center">
                        <span>{name}</span>
                        <input type="number" name={key} id={key} defaultValue={default_values[key] as number}
                            className="border-[2px] rounded bg-neutral-100 border-neutral-700/60 px-2 p-1 ml-2 items-end w-[200px]" />
                    </li>
                )
            case 'string':
                return (
                    <li key={key} className="flex justify-between items-center">
                        <span>{name}</span>
                        <input type="text" name={key} id={key} defaultValue={default_values[key] as string}
                            className="border-[2px] rounded bg-neutral-100 border-neutral-700/60 px-2 p-1 ml-2 items-end w-[200px]" />
                    </li>
                )
            default:
                return (
                    <li key={key} className="flex justify-between items-center">
                        <span>{name}</span>
                        <Options default_vaule={default_values[key] as string} ind={key} list={Object.values(config_options[key])}></Options>
                    </li>
                )
        }
    });


    return (
        <>
            {config}
        </>
    )
}


function Options({ list, ind, default_vaule }: Readonly<{ list: string[][]; ind: string; default_vaule: string }>) {

    const opts = list[0].map((item, index) => {
        return (
            <option style={{ fontFamily: "sans-serif" }} key={index}>{item}</option>
        )
    });
    return (
        <select name={ind} id={ind} defaultValue={default_vaule}
            className="bg-neutral-100 border-[2px] border-neutral-700/60 rounded px-2 p-1 ml-2 items-end w-[200px]">
            {opts}
        </select>
    )
}