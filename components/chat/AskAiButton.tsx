"use client";

import { Sparkles } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { openChat, preloadChatPanel } from "@/lib/chat-events";
import { cn } from "@/lib/utils";

export function AskAiButton({
  className,
  label = "Ask my AI",
  variant = "solid",
}: {
  className?: string;
  label?: string;
  variant?: "solid" | "outline";
}) {
  return (
    <button
      type="button"
      onClick={() => {
        trackEvent("chat_open", { label });
        openChat();
      }}
      onPointerEnter={preloadChatPanel}
      onFocus={preloadChatPanel}
      className={cn(
        "pressable inline-flex min-h-12 items-center gap-2 px-5 font-semibold",
        variant === "solid"
          ? "bg-accent text-accent-ink hover:opacity-90"
          : "bg-text text-bg hover:opacity-90",
        className,
      )}
    >
      <Sparkles className="size-4" aria-hidden="true" />
      {label}
    </button>
  );
}
