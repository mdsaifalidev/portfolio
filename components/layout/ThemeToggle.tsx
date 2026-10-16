"use client";

import { Moon, Sun } from "lucide-react";
import { useSyncExternalStore } from "react";
import { toggleTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

// Reads the theme class on <html> (set before paint in app/layout.tsx) and flips it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDarkNow = () => document.documentElement.classList.contains("dark");

export function ThemeToggle({ className }: { className?: string }) {
  const isDark = useSyncExternalStore(subscribe, isDarkNow, () => true);

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "pressable inline-flex min-h-10 min-w-10 items-center justify-center text-muted hover:text-accent",
        className,
      )}
    >
      {isDark ? <Sun key="sun" className="icon-swap size-4" /> : <Moon key="moon" className="icon-swap size-4" />}
    </button>
  );
}
