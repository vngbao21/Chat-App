"use client";

import Markdown from "./Markdown";
import { Attachment, Message } from "../types/message";



export default function MessageItem({ m }: { m: Message }) {
    const mine = m.author === "me";
    return (
        <div className={`flex items-end gap-2 ${mine ? "justify-end" : "justify-start"}`}>
            {!mine && (
                <div className="w-8 h-8 text-xs rounded-full bg-gray-300 text-white flex items-center justify-center">M</div>
            )}
            <div className={`max-w-[80%] border-1 rounded-md p-1`}>
                {m.text && <Markdown text={m.text} />}
            </div>
        </div>
    );
}