"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import type { PaletteItem } from "@/lib/palette";
import { trackEvent } from "@/lib/analytics";

// Loaded on first use only.
const CommandPalette = dynamic(() => import("./CommandPalette").then((m) => m.CommandPalette), { ssr: false });

export const OPEN_PALETTE_EVENT = "portfolio:open-palette";

export function PaletteLauncher({ items }: { items: PaletteItem[] }) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => {
      setMounted(true);
      setOpen(true);
      trackEvent("palette_open");
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey) && !e.altKey && !e.shiftKey) {
        e.preventDefault();
        if (open) setOpen(false);
        else show();
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener(OPEN_PALETTE_EVENT, show);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(OPEN_PALETTE_EVENT, show);
    };
  }, [open]);

  return mounted ? <CommandPalette items={items} open={open} onClose={() => setOpen(false)} /> : null;
}
