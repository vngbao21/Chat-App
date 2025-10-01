"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { Attachment, Message, DraftAttachment } from "../types/message";

type ChatContextValue = {
    messages: Message[];

};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used within ChatProvider");
    return ctx;
}

export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([{
        id: "num-1",
        author: "other",
        text: "Hey! Are you here?",
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
    }]);


    const value = useMemo(() => ({ messages }), [messages]);
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}