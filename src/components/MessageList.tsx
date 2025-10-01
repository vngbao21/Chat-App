"use client"

import { useEffect, useRef, useMemo } from "react";
import { useChat } from "../context/ChatContext";
import MessageItem from "./MessageItem";
import { Message } from "../types/message";

function formatTime(ts: number) {
    const d = new Date(ts);
    const day = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

    return `${day}, ${time}`;
}

function checkTime(prev: Message | null, cur: Message): boolean {
    if (!prev) return true;
    const n = cur.createdAt - prev.createdAt;
    const fifteen = 15 * 60 * 1000;
    const prevDay = new Date(prev.createdAt).toDateString();
    const curDay = new Date(cur.createdAt).toDateString();
    return prevDay !== curDay || n > fifteen;
}

export default function MessageList() {
    const { messages } = useChat();

    const rendered = useMemo(() => {
        const parts: React.ReactNode[] = [];
        let prev: Message | null = null;
        for (const m of messages) {
            if (checkTime(prev, m)) {
                parts.push(
                    <div key={`sep-${m.id}`} className="text-center text-gray-600 text-sm my-2">
                        {formatTime(m.createdAt)}
                    </div>
                );
            }
            parts.push(<MessageItem key={m.id} m={m} />);
            prev = m;
        }
        return parts;
    }, [messages]);

    return (
        <div className="flex-1 p-6 overflow-y-auto space-y-4 min-h-[420px]">
            {rendered}
        </div>
    );
}