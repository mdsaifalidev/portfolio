"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ArrowUp, Mail, RotateCcw, Sparkles, Square, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { profile } from "@/content/profile";
import { trackEvent } from "@/lib/analytics";
import { MAX_INPUT_CHARS, type ChatMessage } from "@/lib/rag/types";
import { cn } from "@/lib/utils";
import { Answer, citedSources } from "./Answer";

const SUGGESTIONS = [
  "What's Saif's experience with RAG and MCP?",
  "Walk me through InsightFlow's architecture.",
  "Is Saif open to remote roles?",
  "Which cloud and DevOps tools has he used?",
];

const transport = new DefaultChatTransport<ChatMessage>({ api: "/api/chat" });

const textOf = (m: ChatMessage) => m.parts.map((p) => (p.type === "text" ? p.text : "")).join("");

export function ChatPanel({
  open,
  onClose,
  question,
}: {
  open: boolean;
  onClose: () => void;
  question?: { text: string; key: number };
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [input, setInput] = useState("");
  const { messages, sendMessage, status, stop, error, regenerate } = useChat<ChatMessage>({ transport });
  const busy = status === "submitted" || status === "streaming";

  // Drive the native <dialog> from React state: it provides the focus trap, Esc and inert background.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      inputRef.current?.focus();
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy || trimmed.length > MAX_INPUT_CHARS) return;
    sendMessage({ text: trimmed });
    trackEvent("chat_message");
    setInput("");
  };

  // A question passed in from elsewhere on the site (e.g. a suggested prompt) is sent once.
  const lastQuestionKey = useRef<number>(undefined);
  useEffect(() => {
    if (!question || question.key === lastQuestionKey.current || status !== "ready") return;
    // Deferred and cancelled on cleanup, so StrictMode's mount/unmount/mount sends exactly once.
    const t = setTimeout(() => {
      lastQuestionKey.current = question.key;
      sendMessage({ text: question.text });
      trackEvent("chat_message");
    }, 0);
    return () => clearTimeout(t);
  }, [question, status, sendMessage]);

  // Keep the newest message in view while streaming.
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, status]);

  const close = () => dialogRef.current?.close();
  const answered = messages.some((m) => m.role === "assistant" && textOf(m));

  return (
    <dialog
      ref={dialogRef}
      className="chat-dialog"
      data-ui
      aria-labelledby="chat-title"
      onClose={onClose}
      onClick={(e) => {
        if (e.target === dialogRef.current) close(); // backdrop click
      }}
    >
      <div className="flex h-full flex-col">
        <header className="flex items-start justify-between gap-4 border-b border-border px-5 py-4"> {/* data-ui panel divider, taste-skill-ignore */}
          <div>
            <h2 id="chat-title" className="flex items-center gap-2 font-medium text-text">
              <Sparkles className="size-4 text-accent" aria-hidden="true" />
              Ask about Saif
            </h2>
            <p className="mt-1 text-step-0 leading-relaxed">
              Answers come from his CV and case studies, with sources. AI can make mistakes.
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Close assistant"
            className="pressable inline-flex size-10 shrink-0 items-center justify-center text-muted hover:bg-surface hover:text-text"
          >
            <X className="size-4" />
          </button>
        </header>

        <div ref={logRef} role="log" aria-live="polite" className="flex-1 space-y-6 overflow-y-auto overscroll-contain px-5 py-6 text-sm leading-relaxed">
          {messages.length === 0 && (
            <div>
              <p>
                Hi! I can answer questions about Saif&apos;s experience, projects and skills - try one of these:
              </p>
              <ul className="mt-4 space-y-2">
                {SUGGESTIONS.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => send(s)}
                      className="pressable w-full border border-border bg-surface px-3 py-2 text-left text-text hover:border-accent hover:text-accent"
                    >
                      {s}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {messages.map((m, i) => {
            const text = textOf(m);
            const streamingThis = busy && i === messages.length - 1;
            if (m.role === "user") {
              return (
                <div key={m.id} className="flex justify-end">
                  <p className="max-w-[85%] bg-accent-soft px-4 py-2 whitespace-pre-wrap text-text">
                    {text}
                  </p>
                </div>
              );
            }
            const sources = m.metadata?.sources ?? [];
            const cited = citedSources(text, sources);
            return (
              <div key={m.id}>
                <Answer text={text} sources={sources} onNavigate={close} />
                {cited.length > 0 && !streamingThis && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {cited.map((s) => (
                      <Link
                        key={s.n}
                        href={s.url}
                        onClick={close}
                        className="inline-flex max-w-full items-center gap-1.5 border border-border px-2 py-1 text-step-0 hover:border-accent hover:text-accent"
                      >
                        <span className="text-accent">{s.n}</span>
                        <span className="truncate">{s.title}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {status === "submitted" && (
            <p className="breathe text-muted">Searching my CV and case studies...</p>
          )}

          {error && (
            <div className="border border-warn/40 bg-warn/10 p-3 text-text">
              <p>{error.message || "Something went wrong."}</p>
              <button
                type="button"
                onClick={() => regenerate()}
                className="mt-2 inline-flex items-center gap-1.5 text-step-0 text-accent hover:underline"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                Try again
              </button>
            </div>
          )}

          {answered && !busy && (
            <p className="border-t border-border pt-4 text-step-0"> {/* taste-skill-ignore */}
              Want to talk to Saif directly?{" "}
              <a href={`mailto:${profile.email}`} className="inline-flex items-center gap-1 text-accent hover:underline">
                <Mail className="size-3.5" aria-hidden="true" />
                {profile.email}
              </a>
            </p>
          )}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            send(input);
          }}
          className="border-t border-border p-4" /* data-ui panel divider, taste-skill-ignore */
        >
          <div className="flex items-end gap-2 border border-border bg-surface p-2 focus-within:border-accent">
            <label htmlFor="chat-input" className="sr-only">
              Your question
            </label>
            <textarea
              id="chat-input"
              ref={inputRef}
              autoFocus
              rows={1}
              enterKeyHint="send"
              value={input}
              maxLength={MAX_INPUT_CHARS}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                  e.preventDefault();
                  send(input);
                }
              }}
              placeholder="Ask about Saif's experience..."
              className="field-sizing-content max-h-32 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-text placeholder:text-muted pointer-coarse:text-base focus:outline-none"
            />
            {busy ? (
              <button
                type="button"
                onClick={() => stop()}
                aria-label="Stop generating"
                className="pressable inline-flex size-9 shrink-0 items-center justify-center border border-border text-text hover:border-accent"
              >
                <Square className="size-3.5" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send question"
                className="pressable inline-flex size-9 shrink-0 items-center justify-center bg-accent text-bg disabled:opacity-40"
              >
                <ArrowUp className="size-4" />
              </button>
            )}
          </div>
          <p className={cn("mt-1.5 text-right text-step-0", input.length > MAX_INPUT_CHARS - 50 && "text-warn")}>
            {input.length}/{MAX_INPUT_CHARS}
          </p>
        </form>
      </div>
    </dialog>
  );
}
