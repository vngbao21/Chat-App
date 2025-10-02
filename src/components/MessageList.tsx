"use client"

import { useEffect, useRef, useMemo } from "react";
import { useChat } from "../context/ChatContext";
import MessageItem from "./MessageItem";
import { Message } from "../types/message";

function formatTime(ts: number) {
    const d = new Date(ts);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const month = months[d.getMonth()];
    const dayNum = d.getDate();
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${month} ${dayNum}, ${hh}:${mm}`;
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
    const endRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages.length]);

    const rendered = useMemo(() => {
        const parts: React.ReactNode[] = [];
        let prev: Message | null = null;
        for (const m of messages) {
            const shouldShowTime = checkTime(prev, m);
            if (shouldShowTime) {
                parts.push(
                    <div key={`sep-${m.id}`} className="text-center text-gray-600 text-sm my-2">
                        {formatTime(m.createdAt)}
                    </div>
                );
                prev = m;
            }
            parts.push(<MessageItem key={m.id} m={m} />);
        }
        return parts;
    }, [messages]);

    return (
        <div className="flex-1 overflow-y-auto no-scrollbar p-3 sm:p-6 space-y-3 sm:space-y-4 min-h-[420px]">
            {rendered}
            <div ref={endRef} />
        </div>
    );
}