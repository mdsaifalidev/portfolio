"use client";

import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { OPEN_PALETTE_EVENT } from "@/components/palette/PaletteLauncher";
import type { NavItem } from "@/content/profile";
import { trackEvent } from "@/lib/analytics";
import { openChat, preloadChatPanel } from "@/lib/chat-events";
import { cn } from "@/lib/utils";

const openPalette = () => window.dispatchEvent(new Event(OPEN_PALETTE_EVENT));

/**
 * What is left of the hero datasheet once you scroll: a small ink tab pinned bottom-right (clear of the
 * left-aligned headings) carrying the
 * part name, the main sections, the assistant, the index (command palette) and the theme.
 */
export function Stub({ items }: { items: NavItem[] }) {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const [active, setActive] = useState<string>();
  const primary = useMemo(() => items.filter((i) => i.primary), [items]);

  useEffect(() => {
    if (!onHome) return;
    // A section is active while it crosses a thin band just above the viewport's middle.
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id);
      },
      { rootMargin: "-35% 0px -60% 0px" },
    );
    for (const { id } of primary) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, [primary, onHome]);

  return (
    <div className="ink-field fixed right-3 bottom-[max(0.75rem,env(safe-area-inset-bottom,0px))] z-40 sm:right-5 flex items-stretch shadow-[0_12px_32px_rgb(0_0_0/0.28)] select-none lg:bottom-5"> {/* floats over the page: taste-skill-ignore */}
      <Link href="/" className="pressable condensed flex items-center bg-accent px-3 text-lg text-accent-ink" aria-label="Md. Saif Ali, home">
        MSA
      </Link>

      <nav aria-label="Sections" className="hidden items-stretch lg:flex">
        {primary.map(({ id, label }) => {
          const isActive = onHome && active === id;
          return (
            <a
              key={id}
              href={onHome ? `#${id}` : `/#${id}`}
              aria-current={isActive ? "location" : undefined}
              className={cn(
                "pressable flex items-center px-3 text-step-0 font-medium hover:bg-field-tone",
                isActive && "bg-field-tone text-field-accent",
              )}
            >
              {label}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={() => {
          trackEvent("chat_open", { label: "stub" });
          openChat();
        }}
        onPointerEnter={preloadChatPanel}
        onFocus={preloadChatPanel}
        className="pressable flex items-center px-3 py-2.5 text-step-0 font-semibold text-field-accent hover:bg-field-tone"
      >
        Ask
      </button>

      <button
        type="button"
        onClick={openPalette}
        aria-label="Open command menu"
        aria-keyshortcuts="Control+K Meta+K"
        className="pressable flex items-center gap-2 px-3 text-step-0 hover:bg-field-tone"
      >
        <Menu className="size-4 lg:hidden" aria-hidden="true" />
        <Search className="hidden size-4 lg:block" aria-hidden="true" />
        <span className="hidden text-field-muted xl:inline">Ctrl K</span>
      </button>

      <ThemeToggle className="flex items-center px-3 hover:bg-field-tone" />
    </div>
  );
}
