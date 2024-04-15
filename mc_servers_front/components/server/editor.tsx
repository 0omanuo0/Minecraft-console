"use client";
import Editor, { useMonaco, } from '@monaco-editor/react';
import { minecraftTheme, otherMinecraftTheme, listLanguages } from "@/lib/theme_data";

// import event onchange monaco

import { useEffect, useState } from 'react';
import { log } from 'console';
import { list } from 'postcss';



export default function MCEditor(
    { content, onChange, fileType, value }
        : { content: string | undefined; onChange?: (value: string | undefined) => void; fileType: string ; value?: string | undefined}
) {
    const monaco = useMonaco();

    useEffect(() => {
        if (!monaco) return;
        monaco.editor.defineTheme("minecraftTheme", minecraftTheme);
        monaco.editor.defineTheme("otherMinecraftTheme", otherMinecraftTheme);


        Object.keys(listLanguages).forEach((lang) => {
            monaco.languages.register({ id: lang });
            monaco.languages.setMonarchTokensProvider(lang, listLanguages[lang]);
        });

        // set theme
        monaco.editor.setTheme(listLanguages[fileType] ? 'otherMinecraftTheme' : 'minecraftTheme');

        console.log(fileType);
        console.log(listLanguages[fileType] ? 'otherMinecraftTheme' : 'minecraftTheme');


        // onload send to bottom
        window.scrollTo(0, document.body.scrollHeight);

    })

    return (
        <div className=" h-1/2">
            <Editor
                value={content}
                onChange={onChange}
                width="100%"
                height="24rem"
                language={fileType}
                defaultValue={content}
                loading={<p className=" text-black text-2xl">Loading...</p>}
            />
        </div>
    );
};