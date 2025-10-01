"use client";

import React from "react";

// Very small markdown renderer supporting:
// - **bold**, *italic*, `code`
// - links [text](url)
// - unordered (-, *) and ordered lists (1.)
// - line breaks and paragraphs

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
    // Block parsing for lists and paragraphs
    const lines = text.split(/\r?\n/);
    const htmlParts: string[] = [];
    let i = 0;
    while (i < lines.length) {
        const line = lines[i];
        // Headings: #, ##, ###
        const headingMatch = /^\s*(#{1,3})\s+(.+)$/.exec(line);
        if (headingMatch) {
            const level = headingMatch[1].length;
            const content = renderInline(headingMatch[2]);
            const tag = level === 1 ? "h1" : level === 2 ? "h2" : "h3";
            const cls = level === 1
                ? 'text-xl font-semibold'
                : level === 2
                    ? 'text-lg font-semibold'
                    : 'text-base font-semibold';
            htmlParts.push(`<${tag} class="${cls}">${content}<\/${tag}>`);
            i++;
            continue;
        }

        // Blockquote: > text
        const quoteMatch = /^\s*>\s?(.*)$/.exec(line);
        if (quoteMatch) {
            const content = renderInline(quoteMatch[1]);
            htmlParts.push(`<blockquote class="border-l-2 border-black\/20 dark:border-white\/20 pl-3 italic">${content}<\/blockquote>`);
            i++;
            continue;
        }
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
    // eslint-disable-next-line react/no-danger
    return <div className="space-y-1" dangerouslySetInnerHTML={{ __html: html }} />;
}



