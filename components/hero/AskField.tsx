"use client";

import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { trackEvent } from "@/lib/analytics";
import { openChat, preloadChatPanel } from "@/lib/chat-events";
import { MAX_INPUT_CHARS } from "@/lib/rag/types";

const EXAMPLES = ["Has he shipped an MCP server?", "Is he open to remote roles?"];

/**
 * The datasheet's "typical application": a real question field on the first screen. The answer streams
 * in the assistant drawer with numbered sources. Without JavaScript the form falls through to #contact.
 */
export function AskField() {
  const [question, setQuestion] = useState("");

  const ask = (text: string) => {
    const trimmed = text.trim();
    trackEvent("chat_open", { label: "hero field" });
    openChat(trimmed ? { question: trimmed } : {});
    setQuestion("");
  };

  return (
    <div>
      <form
        action="#contact"
        onSubmit={(e) => {
          e.preventDefault();
          ask(question);
        }}
        className="flex items-stretch bg-surface focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent"
      >
        <label htmlFor="hero-ask" className="sr-only">
          Ask my AI about my work
        </label>
        <input
          id="hero-ask"
          name="q"
          type="text"
          value={question}
          maxLength={MAX_INPUT_CHARS}
          autoComplete="off"
          enterKeyHint="send"
          onChange={(e) => setQuestion(e.target.value)}
          onFocus={preloadChatPanel}
          placeholder="Ask about my work..."
          className="min-w-0 flex-1 bg-transparent px-4 py-3.5 text-step-1 text-text placeholder:text-muted focus:outline-none"
        />
        <button
          type="submit"
          onPointerEnter={preloadChatPanel}
          className="pressable inline-flex items-center gap-2 bg-accent px-5 font-semibold text-accent-ink hover:opacity-90"
        >
          Ask my AI
          <ArrowRight className="size-4" aria-hidden="true" />
        </button>
      </form>
      <p className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-step-0 text-muted">
        <span>Try</span>
        {EXAMPLES.map((q) => (
          <button key={q} type="button" onClick={() => ask(q)} className="pressable link text-text">
            {q}
          </button>
        ))}
      </p>
    </div>
  );
}
