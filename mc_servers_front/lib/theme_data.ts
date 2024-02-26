// import editor.IStandaloneThemeData
import type { editor, languages } from "monaco-editor";


export const otherMinecraftTheme: editor.IStandaloneThemeData = {
    base: "vs",
    inherit: false,
    rules: [
        { token: "log_error", foreground: "880000" },
        { token: "warning", foreground: "888800" },
        { token: "info", foreground: "888800" },
        { token: "debug", foreground: "000088" },
        { token: "hour", foreground: "008800" },
        { token: "verbose", foreground: "008888" },
        { token: "error", foreground: "880000" },
        { token: "date", foreground: "888888" },
        { token: "exception", foreground: "880000" },
        { token: "exception_type", foreground: "880000" },
        { token: "constant", foreground: "888888" },
        { token: "string", foreground: "888888" },
        { token: "value", foreground: "888888" },
        { token: "comment", foreground: "008800" },
        { token: "boolean", foreground: "000088"},
        { token: "number", foreground: "008888"},
    ],
    colors: {
        "editor.background": "#f5f2f0",
    },
};

export const minecraftTheme: editor.IStandaloneThemeData = {
    base: "vs",
    inherit: true,
    rules: [
        { token: "log_error", foreground: "880000" },
    ],
    colors: {
        "editor.background": "#f5f2f0",
    },
};


const logRegex: languages.IMonarchLanguage = {
    tokenizer: {

        // example: 
        // [19:39:59] [ServerMain/INFO]: Loaded 7 recipes
        // [19:39:59] [ServerMain/INFO]: Loaded 1271 advancements
        root: [
            [/^\[[0-9]{2}:[0-9]{2}:[0-9]{2}\]/, "hour"],
            [/\b(Trace)\b:/, "verbose"],
            // Serilog VERBOSE
            [/\[(verbose|verb|vrb|vb|v)\]/i, "verbose"],
            // Android logcat Verboce
            [/\bV\//, "verbose"],
            // DEBUG
            [/\b(DEBUG|Debug)\b|\b([dD][eE][bB][uU][gG])\:/, "debug"],
            // Serilog DEBUG
            [/\[(debug|dbug|dbg|de|d)\]/i, "debug"],
            // Android logcat Debug
            [/\bD\//, "debug"],
            // INFO
            [
                /\b(HINT|INFO|INFORMATION|Info|NOTICE|II)\b|\b([iI][nN][fF][oO]|[iI][nN][fF][oO][rR][mM][aA][tT][iI][oO][nN])\:/,
                "info"
            ],
            // serilog INFO
            [/\[(information|info|inf|in|i)\]/i, "info"],
            // Android logcat Info
            [/\bI\//, "info"],
            // WARN
            [
                /\b(WARNING|WARN|Warn|WW)\b|\b([wW][aA][rR][nN][iI][nN][gG])\:/,
                "warning"
            ],
            // Serilog WARN
            [/\[(warning|warn|wrn|wn|w)\]/i, "warning"],
            // Android logcat Warning
            [/\bW\//, "warning"],
            // ERROR
            [
                /\b(ALERT|CRITICAL|EMERGENCY|ERROR|FAILURE|FAIL|Fatal|FATAL|Error|EE)\b|\b([eE][rR][rR][oO][rR])\:/,
                "error"
            ],
            // Serilog ERROR
            [/\[(error|eror|err|er|e|fatal|fatl|ftl|fa|f)\]/i, "error"],
            // Android logcat Error
            [/\bE\//, "error"],
            // ISO dates ("2020-01-01")
            [/\b\d{4}-\d{2}-\d{2}(T|\b)/, "date"],
            // Culture specific dates ("01/01/2020", "01.01.2020")
            [/\b\d{2}[^\w\s]\d{2}[^\w\s]\d{4}\b/, "date"],
            // Clock times with optional timezone ("01:01:01", "01:01:01.001", "01:01:01+01:01")
            [
                /\d{1,2}:\d{2}(:\d{2}([.,]\d{1,})?)?(Z| ?[+-]\d{1,2}:\d{2})?\b/,
                "date"
            ],
            // Git commit hashes of length 40, 10, or 7
            [
                /\b([0-9a-fA-F]{40}|[0-9a-fA-F]{10}|[0-9a-fA-F]{7})\b/,
                "constant"
            ],
            // Guids
            [
                /[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}/,
                "constant"
            ],
            // Constants
            [/\b([0-9]+|true|false|null)\b/, "constant"],
            // String constants
            [/"[^"]*"/, "string"],
            [/(?<![\w])'[^']*'/, "string"],
            // Exception type names
            [/\b([a-zA-Z.]*Exception)\b/, "exceptiontype"],
            // Colorize rows of exception call stacks
            [/^[\t ]*at.*$/, "exception"],
            // Match Urls
            [/\b(http|https|ftp|file):\/\/\S+\b\/?/, "constant"],
            // Match character and . sequences (such as namespaces) as well as file names and extensions (e.g. bar.txt)
            [/(?<![\w/\\])([\w-]+\.)+([\w-])+(?![\w/\\])/, "constant"],
        ],
    }
};


const propertiesRegex: languages.IMonarchLanguage = {
    tokenizer: {
        root: [
            [/^#.*$/, "comment"],
            [/\b(true|false)/, "boolean"],
            [/\d+/, "number"],
            [/"[^"]*"/, "string"],
        ],
    },
};

export const listLanguages : {[key in string]:languages.IMonarchLanguage} = {
    "log": logRegex,
    "properties": propertiesRegex,
    "txt": propertiesRegex,
}
