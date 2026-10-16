"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { OPEN_CHAT_EVENT, type OpenChatDetail } from "@/lib/chat-events";

// The panel (and the AI SDK client) only loads once someone opens the assistant. Entry points
// (status line, hero, contact, command palette) open it through the `openChat` event.
const ChatPanel = dynamic(() => import("./ChatPanel").then((m) => m.ChatPanel), { ssr: false });

export function ChatLauncher() {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState<{ text: string; key: number }>();

  useEffect(() => {
    const onOpen = (e: Event) => {
      const { question: text } = (e as CustomEvent<OpenChatDetail>).detail ?? {};
      if (text) setQuestion({ text, key: Date.now() });
      setMounted(true);
      setOpen(true);
    };
    window.addEventListener(OPEN_CHAT_EVENT, onOpen);
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen);
  }, []);

  return mounted ? <ChatPanel open={open} onClose={() => setOpen(false)} question={question} /> : null;
}
