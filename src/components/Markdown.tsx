"use client";

import React from "react";

type Props = {
    text: string;
};

function escapeHtml(input: string): string {
    return input
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");
}

function renderInline(line: string): string {
    let out = escapeHtml(line);
    out = out.replace(/`([^`]+)`/g, (_m, g1) => `<code class="px-1 py-0.5 rounded bg-black\/5 dark:bg-white\/10">${g1}</code>`);
    out = out.replace(/\*\*([^*]+)\*\*/g, "<strong>$1<\/strong>");
    out = out.replace(/\*([^*]+)\*/g, "<em>$1<\/em>");
    out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a class="text-blue-600 hover:underline" href="$2" target="_blank" rel="noreferrer">$1<\/a>');
    return out;
}

export default function Markdown({ text }: Props) {
    const lines = text.split(/\r?\n/);
    const htmlParts: string[] = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        if (/^\s*[-*]\s+/.test(line)) {
            htmlParts.push('<ul class="list-disc pl-5 space-y-1">');
            while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
                const item = lines[i].replace(/^\s*[-*]\s+/, "");
                htmlParts.push(`<li>${renderInline(item)}<\/li>`);
                i++;
            }
            htmlParts.push("</ul>");
            continue;
        }
        if (/^\s*\d+\.\s+/.test(line)) {
            htmlParts.push('<ol class="list-decimal pl-5 space-y-1">');
            while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
                const item = lines[i].replace(/^\s*\d+\.\s+/, "");
                htmlParts.push(`<li>${renderInline(item)}<\/li>`);
                i++;
            }
            htmlParts.push("</ol>");
            continue;
        }
        if (line.trim() === "") {
            htmlParts.push("<br/>");
            i++;
            continue;
        }
        htmlParts.push(`<p>${renderInline(line)}<\/p>`);
        i++;
    }

    const html = htmlParts.join("\n");
    return <div className="space-y-1" dangerouslySetInnerHTML={{ __html: html }} />;
}



