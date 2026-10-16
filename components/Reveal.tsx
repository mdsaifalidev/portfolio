"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/**
 * Marks each `[data-reveal]` block with `.is-in` the first time it enters the viewport; the CSS in
 * globals.css staggers its children in. Content is only hidden once this has run (`.reveal-ready`),
 * so without JavaScript, or under reduced motion, everything is simply there.
 */
export function Reveal() {
  const pathname = usePathname();

  useEffect(() => {
    const root = document.documentElement;
    const blocks = [...document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-in)")];
    // Whatever is already on screen when the page loads shows straight away.
    for (const el of blocks) if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add("is-in");
    root.classList.add("reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    for (const el of blocks) if (!el.classList.contains("is-in")) observer.observe(el);
    return () => observer.disconnect();
  }, [pathname]);

  return null;
}
