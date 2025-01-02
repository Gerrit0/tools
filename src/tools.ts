import { stripCopy } from "./copy";

export interface Tool {
    name: string;
    placeholder: string;
    transform: (text: string) => string;
}

export const tools: Tool[] = [
    {
        name: "Sort lines",
        transform: text =>
            text.split("\n").sort((a, b) => a.localeCompare(b, "standard", { sensitivity: "base" })).join("\n"),
        placeholder: "b\na",
    },
    {
        name: "Unique lines",
        transform: text => {
            const seen = new Set();
            const result = [];
            for (const line of text.split("\n")) {
                if (seen.has(line)) continue;
                seen.add(line);
                result.push(line);
            }
            return result.join("\n");
        },
        placeholder: "a\nb\na",
    },
    {
        name: "Strip Kindle Copy",
        transform: stripCopy,
        placeholder: "",
    },
];
