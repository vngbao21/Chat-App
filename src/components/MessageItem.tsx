"use client";

import Markdown from "./Markdown";
import { Attachment, Message } from "../types/message";
import { useChat } from "../context/ChatContext";
import { useState } from "react";


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
    const { addReaction, removeReaction } = useChat();
    const [showReactions, setShowReactions] = useState(false);

    const throwReaction = (emoji: string) => {
        const userId = "me"; // demo 
        const exists = m.reactions?.some((r) => r.userId === userId && r.emoji === emoji);
        if (exists) {
            removeReaction(m.id, userId, emoji);
        } else {
            addReaction(m.id, { emoji, userId, displayName: "You" });
        }
    };

    return (
        <div className={`flex gap-2 ${mine ? "justify-end" : "justify-start"}`}>
            {!mine && (
                <div className="w-8 h-8 text-xs rounded-full bg-gray-300 text-white flex items-center justify-center">M</div>
            )}
            <div className="relative group max-w-[88%] sm:max-w-[80%] space-y-2"
                onMouseEnter={() => setShowReactions(true)}
                onMouseLeave={() => setShowReactions(false)}>
                {hasText && (
                    <div className={`rounded-md px-3 py-2 shadow-sm ${mine ? "bg-blue-600 text-white" : "bg-black/5 border-2"}`}>
                        <Markdown text={m.text as string} textSize={m.textSize} />
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
                    className={`absolute bottom-0 ${mine ? "right-full ml-2" : "left-full mr-2"} block opacity-0 group-hover:opacity-100 transition-opacity`}
                >
                    <div className="px-2 py-0.5 rounded-xs text-xs bg-gray-200 dark:bg-white/15 text-gray-700 dark:text-gray-200 shadow whitespace-nowrap">
                        {formatTime(m.createdAt)}
                    </div>
                </div>

                {/* Reactions list */}
                {m.reactions && m.reactions.length > 0 && (
                    <div className="flex gap-2 mt-1">
                        {m.reactions.map((r, idx) => (
                            <span
                                key={idx}
                                className="px-2 py-0.5 rounded-full bg-gray-100 text-sm cursor-pointer hover:bg-gray-200"
                                title={r.displayName ?? r.userId}
                                onClick={() => throwReaction(r.emoji)}
                            >
                                {r.emoji}
                            </span>
                        ))}
                    </div>
                )}

                {/* Emoji picker on hover */}
                {showReactions && (
                    <div
                        className={`absolute -top-8 flex gap-1 bg-white border rounded-md shadow p-1 m-1 ${mine ? "right-0" : "left-0"}`}
                    >
                        {["👍", "❤️", "😂", "😮", "😢"].map((emoji) => (
                            <button
                                key={emoji}
                                onClick={() => throwReaction(emoji)}
                                className="hover:bg-gray-100 rounded px-1"
                            >
                                {emoji}
                            </button>
                        ))}
                    </div>
                )}


            </div>

        </div>
    );
}