export type AttachmentKind = "image" | "file";

export type Attachment = {
    id: string;
    kind: AttachmentKind;
    name: string;
    size: number;
    url: string; // object URL for preview
    mime: string;
};

export type Reaction = {
    emoji: string;
    userId: string;
    displayName?: string;
};

export type Message = {
    id: string;
    author: "me" | "other";
    text: string;
    textSize?: "sm" | "md" | "lg";
    createdAt: number; // epoch ms
    attachments?: Attachment[];
    reactions?: Reaction[];
};

export type DraftAttachment = Attachment & { file: File }; // status (when not sent)
