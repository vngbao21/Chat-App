"use client";

import { createContext, useContext, useMemo, useState, useCallback } from "react";
import { Attachment, Message, DraftAttachment, Reaction } from "../types/message";

type ChatContextValue = {
    messages: Message[];
    sendMessage: (
        text: string,
        attachments?: DraftAttachment[],
        textSize?: "sm" | "md" | "lg"
    ) => void;
    addDraftFiles: (files: FileList | File[]) => Promise<DraftAttachment[]>;
    revokeDraftFiles: (drafts: DraftAttachment[]) => void;
    addReaction: (messageId: string, reaction: Reaction) => void;
    removeReaction: (messageId: string, userId: string, emoji: string) => void;
};

const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat() {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used within ChatProvider");
    return ctx;
}

function fileToDraft(file: File): DraftAttachment {
    const url = URL.createObjectURL(file);
    const isImage = file.type.startsWith("image/");
    return {
        id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        kind: isImage ? "image" : "file",
        name: file.name,
        size: file.size,
        url,
        mime: file.type || "application/octet-stream",
        file,
    };
}


export function ChatProvider({ children }: { children: React.ReactNode }) {
    const [messages, setMessages] = useState<Message[]>([{
        id: "num-1",
        author: "other",
        text: "Hey! Are you here?",
        createdAt: Date.now() - 1000 * 60 * 60 * 24,
        reactions: [],
    }]);

    const sendMessage = useCallback((text: string, attachments?: DraftAttachment[], textSize?: "sm" | "md" | "lg") => {
        const atts: Attachment[] | undefined = attachments?.map(({ file: _f, ...rest }) => rest);
        setMessages(prev => [
            ...prev,
            {
                id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
                author: "me",
                text,
                createdAt: Date.now(),
                attachments: atts && atts.length ? atts : undefined,
                reactions: [],
                textSize: textSize ?? "md",
            },
        ]);
    }, []);

    const addDraftFiles = useCallback(async (files: FileList | File[]) => {
        const list: File[] = Array.from(files as any);
        const drafts = list.map(fileToDraft);
        return drafts;
    }, []);

    const revokeDraftFiles = useCallback((drafts: DraftAttachment[]) => {
        drafts.forEach(d => URL.revokeObjectURL(d.url));
    }, []);

    const addReaction = (messageId: string, reaction: Reaction) => {
        setMessages((prev) =>
            prev.map((m) =>
                m.id === messageId
                    ? {
                        ...m,
                        reactions: [
                            ...(m.reactions ?? []).filter(
                                (r) => !(r.userId === reaction.userId && r.emoji === reaction.emoji)
                            ),
                            reaction,
                        ],
                    }
                    : m
            )
        );
    };

    const removeReaction = (messageId: string, userId: string, emoji: string) => {
        setMessages((prev) =>
            prev.map((m) =>
                m.id === messageId
                    ? { ...m, reactions: (m.reactions ?? []).filter((r) => !(r.userId === userId && r.emoji === emoji)) }
                    : m
            )
        );
    };

    const value = useMemo(() => ({ messages, sendMessage, addDraftFiles, revokeDraftFiles, addReaction, removeReaction }), [messages, sendMessage, addDraftFiles, revokeDraftFiles, addReaction, removeReaction]);
    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}