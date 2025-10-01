"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useChat } from "../context/ChatContext";
import { DraftAttachment } from "../types/message";


export default function Composer() {
    const { sendMessage, addDraftFiles, revokeDraftFiles } = useChat();
    const [text, setText] = useState("");
    const [drafts, setDrafts] = useState<DraftAttachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const [textSize, setTextSize] = useState<"sm" | "md" | "lg">("md");


    const hasContent = useMemo(() => text.trim().length > 0 || (drafts && drafts.length > 0), [text, drafts]);

    function handleSend() {
        if (!hasContent) return;
        sendMessage(text.trim(), drafts);
        setText("");
        setDrafts([]);
    }

    // send with Enter, newline with Shift+Enter
    function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    useEffect(() => () => revokeDraftFiles(drafts), []);


    function wrapSelection(before: string, after: string = before) {
        const el = textareaRef.current;
        if (!el) return;
        const start = el.selectionStart ?? 0;
        const end = el.selectionEnd ?? 0;
        const value = text;
        const selected = value.slice(start, end);
        const next = value.slice(0, start) + before + selected + after + value.slice(end);
        setText(next);
        // restore selection to inside tokens
        const cursorStart = start + before.length;
        const cursorEnd = cursorStart + selected.length;
        requestAnimationFrame(() => {
            el.focus();
            el.setSelectionRange(cursorStart, cursorEnd);
        });
    }

    function onBold() { wrapSelection("**"); }
    function onItalic() { wrapSelection("*"); }
    function onCodeInline() { wrapSelection("`"); }
    function onLink() { wrapSelection("[", "](https://)"); }
    function onBullet() { wrapSelection("- ", ""); }
    function onNumbered() { wrapSelection("1. ", ""); }
    function onQuote() { wrapSelection("> ", ""); }
    function onH1() { wrapSelection("# ", ""); }
    function onH2() { wrapSelection("## ", ""); }
    function cycleTextSize() {
        setTextSize((prev) => (prev === "sm" ? "md" : prev === "md" ? "lg" : "sm"));
    }


    return (
        <div className="p-3 border-t border-black/10 shadow-md dark:border-white/10" style={{ boxShadow: "2px 2px 6px rgba(0,0,0,0.2)" }}>
            {drafts && drafts.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                    {drafts.map((d: any) => (
                        <div key={d.id} className="relative">
                            {d.kind === "image" ? (
                                <img src={d.url} alt={d.name} className="h-20 w-20 object-cover rounded-md" />
                            ) : (
                                <div className="h-20 w-32 rounded-md bg-black/5 dark:bg-white/10 flex items-center justify-center text-xs px-2 text-center">
                                    {d.name}
                                </div>
                            )}
                            <button className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-6 h-6 text-xs">×</button>
                        </div>
                    ))}
                </div>
            )}
            <div className="relative rounded-2xl bg-white dark:bg-black/40 border-2 dark:border-white/15">
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-1 px-3 pt-2 pb-1 text-base border-b border-black/10 dark:border-white/15">
                        <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded font-semibold" title="Bold" onClick={onBold}>B</button>
                        <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded italic" title="Italic" onClick={onItalic}>I</button>
                        <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded line-through" title="Strikethrough" onClick={onCodeInline}>S</button>
                        <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Link" onClick={onLink}>📎</button>
                        <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Bulleted list" onClick={onBullet}>☰</button>
                        <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Numbered list" onClick={onNumbered}>≡</button>
                        <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Quote" onClick={onQuote}>❝❞</button>
                        <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Code" onClick={onCodeInline}>⟨/⟩</button>
                        <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Text size" onClick={cycleTextSize}>Aa</button>

                    </div>
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            className={`w-full resize-none px-3 py-3 min-h-[60px] max-h-32 focus:outline-none bg-transparent ${textSize === "sm" ? "text-sm" : textSize === "lg" ? "text-lg" : "text-base"}`}
                            placeholder="Type your message here"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={onKeyDown}
                            rows={1}
                        />

                        <input ref={fileInputRef} type="file" multiple hidden />
                        <div className="px-3 py-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Heading 1" onClick={onH1}>H1</button>
                                <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Heading 2" onClick={onH2}>H2</button>
                                <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Attach file" onClick={() => fileInputRef.current?.click()}>🔗</button>

                            </div>
                            <button
                                type="button"
                                disabled={!hasContent}
                                onClick={handleSend}
                                className={`absolute bottom-3 right-3 p-2 rounded ${hasContent ? "text-blue-600 hover:bg-blue-50 " : "text-gray-400 cursor-not-allowed"}`}
                                title="Send message"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="2" x2="11" y2="13"></line>
                                    <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}