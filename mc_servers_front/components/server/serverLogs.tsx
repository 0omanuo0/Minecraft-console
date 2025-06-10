"use client";

import { Dispatch, useEffect, useRef, useState } from 'react';
import type { Socket } from 'socket.io-client';


function parseColorsAnsi(text: string): string {
    // convert colors from ANSI escape codes to HTML spans
    return text.replace(/\x1b\[([0-9;]+)m(.*?)(?=\x1b\[|$)/g, (match, codes, content) => {
        const codeArray = codes.split(';').map(Number);
        let colorClass = '';

        if (codeArray.includes(30)) colorClass = 'text-black';
        else if (codeArray.includes(31)) colorClass = 'text-red-500';
        else if (codeArray.includes(32)) colorClass = 'text-green-500';
        else if (codeArray.includes(33)) colorClass = 'text-yellow-500';
        else if (codeArray.includes(34)) colorClass = 'text-blue-500';
        else if (codeArray.includes(35)) colorClass = 'text-purple-500';
        else if (codeArray.includes(36)) colorClass = 'text-cyan-500';
        else if (codeArray.includes(37)) colorClass = 'text-gray-500';

        return `<span class="${colorClass}">${content}</span>`;
    });
}

function AddColorLog(text: string): string {

    console.log("AddColorLog: " + text);

    // fist remplace the < and > with &lt; and &gt; to avoid problems with html
    text = text.replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const colors = [
        "text-green-500",
        "text-green-700",
        "text-green-800"
    ]

    // if exists an structure like [12:00:00] set in gray and the rest of things in square brackets [text] as green, the rest in black
    const timeRegex = /\[(\d{1,2}:\d{2}:\d{2})\]/;
    const bracketRegex = /\[(.*?)\]/g;
    let formattedText = text;
    let index_color = 0;
    let colorIndex = 0;
    formattedText = formattedText.replace(bracketRegex, (match, p1) => {
        // First [..] gets 500, second 700, third 800, then repeat
        const color = colors[colorIndex % colors.length];
        colorIndex++;
        return `<span class="${color}">${match}</span>`;
    });
    const timeMatch = formattedText.match(timeRegex);

    if (timeMatch) {
        formattedText = formattedText.replace(timeRegex, `<span class="text-gray-500">[${timeMatch[1]}]</span>`);
    }

    return formattedText;
}

export default function ServerLogs({
    id,
    autoscroll,
    socket,
    addheight = 0
}: {
    id: string;
    autoscroll: boolean;
    socket: Socket;
    addheight: number;
}) {
    const [logData, setLogData]: [string[], Dispatch<any>] = useState([]);
    const containerRef = useRef<HTMLDivElement>(null);

    // 1) Connect + polling
    useEffect(() => {
        console.log("ready");
        socket.connect();

        const onConnect = () => {
            socket.emit('my_event', { data: "I'm connected!" });
            socket.emit('update', { serverid: id });
        };
        socket.on('connect', onConnect);

        const intervalId = setInterval(() => {
            socket.emit('update', { serverid: id });
        }, 1000);

        return () => {
            clearInterval(intervalId);
            socket.off('connect', onConnect);
            socket.disconnect();
        };
    }, [id, socket]);

    // 2) Listen for incoming logs
    useEffect(() => {
        const onRecv = (data: any) => {
            if (data.data === undefined) {
                window.location.replace("/dashboard");
            } else {
                // split each line by \n or \u0000 creating two elements in the array
                const lines = data.data.map((line: string) => {
                    return line.split(/\n|\u0000/).filter(Boolean);
                }).flat();
                setLogData(lines);
            }
        };
        socket.on('recv', onRecv);
        return () => {
            socket.off('recv', onRecv);
        };
    }, [socket]);

    // 3) Auto-scroll whenever logData changes AND autoscroll is true
    useEffect(() => {
        if (autoscroll && containerRef.current) {
            const el = containerRef.current;
            el.scrollTop = el.scrollHeight;
        }
    }, [logData, autoscroll]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleWheel = (e: any) => {
            const atTop = container.scrollTop === 0;
            const atBottom = container.scrollHeight - container.scrollTop === container.clientHeight;

            if ((e.deltaY < 0 && atTop) || (e.deltaY > 0 && atBottom)) {
                e.preventDefault();
            }
        };

        container.addEventListener('wheel', handleWheel, { passive: false });

        return () => {
            container.removeEventListener('wheel', handleWheel);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ height: `calc(50vh + ${addheight}px)` }}
            className={`overflow-y-scroll text-neutral-100 px-10 my-2 font-mono`}
        >
            <div className='hidden text-green-700'></div>
            <div className='hidden text-green-500'></div>
            <div className='hidden text-green-800'></div>
            {logData.map((line, i) => (
                <p key={i} className="text-black">
                    <span dangerouslySetInnerHTML={{ __html: parseColorsAnsi(AddColorLog(line)) }} />
                </p>
            ))}
        </div>
    );
}
