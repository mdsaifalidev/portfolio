import type { Heading } from "@/lib/content";
import { cn } from "@/lib/utils";

export function Toc({ headings }: { headings: Heading[] }) {
  return (
    <nav aria-label="On this page" className="bg-surface px-5 py-5">
      <p className="font-semibold text-text">On this page</p>
      <ul className="mt-3 space-y-2 text-step-0">
        {headings.map((h) => (
          <li key={h.id}>
            <a href={`#${h.id}`} className={cn("block leading-snug hover:text-accent", h.depth === 3 && "pl-4 text-muted")}>
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
