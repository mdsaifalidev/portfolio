// Tiny event bus so any button (server-rendered pages included) can open the assistant
// without the chat panel's code being loaded up front.
export const OPEN_CHAT_EVENT = "portfolio:open-chat";

export type OpenChatDetail = { question?: string };

export function openChat(detail: OpenChatDetail = {}) {
  window.dispatchEvent(new CustomEvent<OpenChatDetail>(OPEN_CHAT_EVENT, { detail }));
}

/** Warm the panel's chunk on hover/focus so the first open feels instant. */
export const preloadChatPanel = () => import("@/components/chat/ChatPanel");
