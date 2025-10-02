"use client";

import Markdown from "./Markdown";
import { Attachment, Message } from "../types/message";

function formatTime(ts: number) {
    const d = new Date(ts);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const dayNum = d.getDate();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${month} ${dayNum}, ${hh}:${mm}`;
}

function AttachmentPreview({ a }: { a: Attachment }) {
    if (a.kind === "image") {
        return (
            <a className="inline-block bg-white border border-black/10 dark:border-white/15 rounded-md p-1" href={a.url} target="_blank" rel="noreferrer">
                <img src={a.url} alt={a.name} className="max-h-48 rounded-md object-cover" />
            </a>
        );
    }
    return (
        <a
            className="flex items-center gap-2 px-3 py-2 rounded-md bg-black/5 dark:border-white/15 hover:bg-black/10 "
            href={a.url}
            download={a.name}
        >
            <span className="inline-block w-2 h-2 rounded-full bg-gray-500" />
            <span className="text-sm truncate max-w-[16rem]" title={a.name}>{a.name}</span>
            <span className="text-xs text-gray-500">{Math.ceil(a.size / 1024)} KB</span>
        </a>
    );
}

export default function MessageItem({ m }: { m: Message }) {
    const mine = m.author === "me";
    const hasText = Boolean(m.text && m.text.trim().length > 0);
    const hasAttachments = Boolean(m.attachments && m.attachments.length > 0);
    return (
        <div className={`flex gap-2 ${mine ? "justify-end" : "justify-start"}`}>
            {!mine && (
                <div className="w-8 h-8 text-xs rounded-full bg-gray-300 text-white flex items-center justify-center">M</div>
            )}
            <div className="relative group max-w-[88%] sm:max-w-[80%] space-y-2">
                {hasText && (
                    <div className={`rounded-md px-3 py-2 shadow-sm ${mine ? "bg-blue-600 text-white" : "bg-black/5 border-2"}`}>
                        <Markdown text={m.text as string} />
                    </div>
                )}
                {hasAttachments && (
                    <div className="space-y-2 rounded-md">
                        {m.attachments!.map(a => (
                            <AttachmentPreview key={a.id} a={a} />
                        ))}
                    </div>
                )}
                {/* Hover time badge - anchored to bubble container */}
                <div
                    className={`absolute bottom-0 ${mine ? "right-full ml-2" : "left-full mr-2"} hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                    <div className="px-2 py-0.5 rounded-xs text-xs bg-gray-200 dark:bg-white/15 text-gray-700 dark:text-gray-200 shadow whitespace-nowrap">
                        {formatTime(m.createdAt)}
                    </div>
                </div>
            </div>

        </div>
    );
}