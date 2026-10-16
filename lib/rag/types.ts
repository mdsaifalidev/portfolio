import type { UIMessage } from "ai";

export type Source = { n: number; title: string; url: string };

/** Sent on the assistant message's first stream part so the UI can render [n] citations. */
export type ChatMetadata = { sources?: Source[] };

export type ChatMessage = UIMessage<ChatMetadata>;

export const MAX_INPUT_CHARS = 500;
