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

    async function onFilesPicked(files: FileList | null) {
        if (!files || files.length === 0) return;
        const list = await addDraftFiles(files);
        setDrafts((prev: any[]) => [...prev, ...list]);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }

    function onPaste(e: React.ClipboardEvent<HTMLTextAreaElement>) {
        const items = e.clipboardData?.files;
        if (items && items.length > 0) {
            e.preventDefault();
            onFilesPicked(items);
        }
    }

    function onDrop(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
        if (e.dataTransfer?.files?.length) {
            onFilesPicked(e.dataTransfer.files);
        }
    }

    function onDragOver(e: React.DragEvent<HTMLDivElement>) {
        e.preventDefault();
    }

    function removeDraft(id: string) {
        const toRemove = drafts.filter((d: any) => d.id === id);
        revokeDraftFiles(toRemove);
        setDrafts((prev: any[]) => prev.filter((d: any) => d.id !== id));
    }

    function handleSend() {
        if (!hasContent) return;
        sendMessage(text.trim(), drafts);
        setText("");
        setDrafts([]);
    }

    // Keyboard shortcuts + send with Enter (newline with Shift+Enter)
    function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        const isMod = e.ctrlKey || e.metaKey;

        // Formatting shortcuts
        if (isMod) {
            // Bold: Ctrl/Cmd + B
            if (e.key.toLowerCase() === "b") {
                e.preventDefault();
                onBold();
                return;
            }
            // Italic: Ctrl/Cmd + I
            if (e.key.toLowerCase() === "i") {
                e.preventDefault();
                onItalic();
                return;
            }
            // Link: Ctrl/Cmd + K
            if (e.key.toLowerCase() === "k") {
                e.preventDefault();
                onLink();
                return;
            }
            // Inline code: Ctrl/Cmd + `
            if (e.key === "`") {
                e.preventDefault();
                onCodeInline();
                return;
            }
            // Strikethrough: Ctrl/Cmd + Shift + X (common in editors)
            if (e.shiftKey && e.key.toLowerCase() === "x") {
                e.preventDefault();
                onStrikethrough();
                return;
            }
            // Numbered list: Ctrl/Cmd + Shift + 7
            if (e.shiftKey && e.key === "7") {
                e.preventDefault();
                onNumbered();
                return;
            }
            // Bulleted list: Ctrl/Cmd + Shift + 8
            if (e.shiftKey && e.key === "8") {
                e.preventDefault();
                onBullet();
                return;
            }
            // Quote: Ctrl/Cmd + Shift + 9
            if (e.shiftKey && e.key === "9") {
                e.preventDefault();
                onQuote();
                return;
            }
            // Headings: Ctrl/Cmd + Alt + 1/2
            if (e.altKey && e.key === "1") {
                e.preventDefault();
                onH1();
                return;
            }
            if (e.altKey && e.key === "2") {
                e.preventDefault();
                onH2();
                return;
            }
        }

        // Send on Enter (but allow newline with Shift+Enter)
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
            return;
        }
    }

    useEffect(() => () => revokeDraftFiles(drafts), []);


    // Helper: wrap selection hoặc insert text
    function wrapSelection(before: string, after: string = before) {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = text.substring(start, end);
        const beforeText = text.substring(0, start);
        const afterText = text.substring(end);

        let newText: string;
        let newCursorPos: number;

        if (selectedText) {
            newText = beforeText + before + selectedText + after + afterText;
            newCursorPos = start + before.length + selectedText.length + after.length;
        } else {
            const placeholder = "text";
            newText = beforeText + before + placeholder + after + afterText;
            newCursorPos = start + before.length + placeholder.length;
        }

        setText(newText);
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }

    // Helper: xử lý line-based formatting (heading, quote, list)
    function applyLinePrefix(prefix: string) {
        const textarea = textareaRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        const beforeCursor = text.substring(0, start);
        const afterCursor = text.substring(end);

        const lineStart = beforeCursor.lastIndexOf('\n') + 1;
        const lineEndInAfter = afterCursor.indexOf('\n');
        const lineEnd = lineEndInAfter === -1 ? text.length : end + lineEndInAfter;

        const selectedLines = text.substring(lineStart, lineEnd);
        const lines = selectedLines.split('\n');

        const newLines = lines.map(line => {
            const trimmed = line.trim();
            if (!trimmed) return line;

            const hasPrefix = line.trimStart().startsWith(prefix);
            if (hasPrefix) {
                return line.replace(new RegExp(`^(\\s*)${prefix.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`), '$1');
            } else {
                const leadingSpace = line.match(/^\s*/)?.[0] || '';
                return leadingSpace + prefix + line.trimStart();
            }
        });

        const newSelectedText = newLines.join('\n');
        const newText = text.substring(0, lineStart) + newSelectedText + text.substring(lineEnd);

        setText(newText);
        setTimeout(() => {
            textarea.focus();
            const newCursorPos = lineStart + newSelectedText.length;
            textarea.setSelectionRange(newCursorPos, newCursorPos);
        }, 0);
    }

    // Formatting functions
    function onBold() { wrapSelection("**"); }
    function onItalic() { wrapSelection("*"); }
    function onStrikethrough() { wrapSelection("~~"); }
    function onCodeInline() { wrapSelection("`"); }
    function onLink() { wrapSelection("[", "](url)"); }
    function onBullet() { applyLinePrefix("- "); }
    function onNumbered() { applyLinePrefix("1. "); }
    function onQuote() { applyLinePrefix("> "); }
    function onH1() { applyLinePrefix("# "); }
    function onH2() { applyLinePrefix("## "); }

    function cycleTextSize() {
        setTextSize((prev) => (prev === "sm" ? "md" : prev === "md" ? "lg" : "sm"));
    }

    const textSizeClass = textSize === "sm" ? "text-sm" : textSize === "md" ? "text-base" : "text-lg";



    return (
        <div onDrop={onDrop} onDragOver={onDragOver} className="p-2 sm:p-3 border-t border-black/10 shadow-md dark:border-white/10" style={{ boxShadow: "2px 2px 6px rgba(0,0,0,0.2)" }}>
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
                            <button onClick={() => removeDraft(d.id)} className="absolute -top-2 -right-2 bg-black/70 text-white rounded-full w-6 h-6 text-xs">×</button>
                        </div>
                    ))}
                </div>
            )}
            <div className="relative rounded-2xl bg-white dark:bg-black/40 border-2 dark:border-white/15">
                <div className="flex flex-col w-full">
                    <div className="flex items-center gap-1 px-1 sm:px-3 pt-1 sm:pt-2 pb-1 text-sm sm:text-base border-b border-black/10 dark:border-white/15 overflow-x-auto no-scrollbar">
                        <div className="flex items-center gap-1 gap-y-1 flex-wrap">
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded font-semibold" title="Bold (Ctrl+B)" onClick={onBold}>B</button>
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded italic" title="Italic (Ctrl+I)" onClick={onItalic}>I</button>
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded line-through" title="Strikethrough" onClick={onStrikethrough}>S</button>
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Code" onClick={onCodeInline}>⟨/⟩</button>
                            <span className="w-px h-6 bg-black/10 dark:bg-white/15 mx-1"></span>
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Link" onClick={onLink}>🔗</button>
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Bulleted list" onClick={onBullet}>•</button>
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Numbered list" onClick={onNumbered}>1.</button>
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Quote" onClick={onQuote}>❝</button>
                            <span className="w-px h-6 bg-black/10 dark:bg-white/15 mx-1"></span>
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Heading 1" onClick={onH1}>H1</button>
                            <button className="px-1.5 py-1 sm:px-2 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Heading 2" onClick={onH2}>H2</button>
                        </div>
                    </div>
                    <div className="relative">
                        <textarea
                            ref={textareaRef}
                            className={`w-full no-scrollbar resize-none px-3 py-3 min-h-[60px] max-h-32 focus:outline-none bg-transparent ${textSize === "sm" ? "text-sm" : textSize === "lg" ? "text-lg" : "text-base"}`}
                            placeholder="Type your message here"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={onKeyDown}
                            onPaste={onPaste}
                            rows={1}
                        />

                        <input ref={fileInputRef} type="file" multiple hidden onChange={(e) => onFilesPicked(e.target.files)} />
                        <div className="px-2 sm:px-3 py-2 flex items-center justify-between">

                            <div className="flex items-center gap-2">
                                <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Text size" onClick={cycleTextSize}>Aa</button>
                                <button className="px-2 py-1 hover:bg-black/5 dark:hover:bg-white/10 rounded" title="Attach file" onClick={() => fileInputRef.current?.click()}>📎</button>
                            </div>
                            <button
                                type="button"
                                disabled={!hasContent}
                                onClick={handleSend}
                                className={`p-2 rounded sm:absolute sm:bottom-3 sm:right-3 ${hasContent ? "text-blue-600 hover:bg-blue-50 " : "text-gray-400 cursor-not-allowed"}`}

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