"use client";
import Editor, { useMonaco, } from '@monaco-editor/react';

// import event onchange monaco

import { useEffect, useState } from 'react';


export default function MCEditor(
    { content, onChange }
        :{ content: string | undefined; onChange?: (value: string | undefined) => void; }
) {
    const monaco = useMonaco();

    // const [defaultContent, setDefaultContent] = useState('');

    // useEffect(() => {

    //     getFileEdit(id, "/home/manu/mc_servers/truquito/server.properties")
    //         .then((result) => {
    //             if (!result) {
    //                 throw new Error("Error: El resultado está vacío");
    //             }
    //             setDefaultContent(result);
    //         })
    //         .catch((error) => {
    //             console.error('Error al obtener el contenido por defecto:', error);
    //         });
    // });

    useEffect(() => {
        if (!monaco) return;
        monaco.editor.defineTheme("myTheme", {
            base: "vs",
            inherit: false,
            rules: [
                // { token: "comment", foreground: "ff0000" },
                // { token: "comment", foreground: "008800" },
            ],
            colors: {
                "editor.background": "#f5f2f0",
            },
        });
        monaco.languages.setMonarchTokensProvider("properties", {
            tokenizer: {
                root: [
                    [/#.*/, "comment"],
                    [/[^#].*$/, "string"],
                    [/$/, "string"],
                ],
            },
        })
        monaco.editor.setTheme('myTheme');
        monaco.languages.register({ id: "log" });
    })



    return (
        <div className="bg-black h-1/2">
            <Editor
                width="100%"
                height="15rem"
                language="json"
                defaultValue={content}
            />
        </div>
    );
};