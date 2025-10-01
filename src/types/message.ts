export type AttachmentKind = "image" | "file";

export type Attachment = {
    id: string;
    kind: AttachmentKind;
    name: string;
    size: number;
    url: string; // object URL for preview
    mime: string;
};

export type Message = {
    id: string;
    author: "me" | "other";
    text: string;
    createdAt: number; // epoch ms
    attachments?: Attachment[];
};

export type DraftAttachment = Attachment & { file: File }; // status (when not sent)
