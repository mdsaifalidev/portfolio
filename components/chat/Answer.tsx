import Link from "next/link";
import type { Source } from "@/lib/rag/types";

// Renders the small markdown subset the assistant is told to use - paragraphs, "- " / "1." lists,
// **bold**, [text](url), bare https:// URLs - plus [n] / [n, m] citations. Everything becomes React
// nodes; no raw HTML.

const INLINE = /(\*\*[^*]+\*\*|\[\d+(?:\s*,\s*\d+)*\]|\[[^\]]+\]\([^)\s]+\)|https?:\/\/[^\s)\]]+[^\s)\].,;:!?])/g;

const safeHref = (href: string) => /^(https?:\/\/|mailto:|\/)/.test(href);

type Props = { text: string; sources: Source[]; onNavigate: () => void };

function Inline({ text, sources, onNavigate }: Props) {
  return (
    <>
      {text.split(INLINE).map((token, i) => {
        if (i % 2 === 0) return token;
        if (token.startsWith("**")) {
          return (
            <strong key={i} className="font-semibold text-text">
              {token.slice(2, -2)}
            </strong>
          );
        }
        if (token.startsWith("http")) {
          return (
            <a key={i} href={token} target="_blank" rel="noreferrer noopener" className="break-all text-text underline decoration-accent underline-offset-2 hover:text-accent">
              {token.replace(/^https?:\/\//, "")}
            </a>
          );
        }
        const link = /^\[([^\]]+)\]\(([^)\s]+)\)$/.exec(token);
        if (link) {
          const [, label, href] = link;
          if (!safeHref(href)) return label;
          return href.startsWith("/") ? (
            <Link key={i} href={href} onClick={onNavigate} className="text-text underline decoration-accent underline-offset-2 hover:text-accent">
              {label}
            </Link>
          ) : (
            <a key={i} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer noopener" className="text-text underline decoration-accent underline-offset-2 hover:text-accent">
              {label}
            </a>
          );
        }
        // Citation(s): [2] or [2, 7]
        const numbers = token.slice(1, -1).split(",").map((n) => Number(n.trim()));
        return (
          <span key={i} className="whitespace-nowrap">
            {numbers.map((n) => {
              const source = sources.find((s) => s.n === n);
              if (!source) return null;
              return (
                <Link
                  key={n}
                  href={source.url}
                  onClick={onNavigate}
                  title={source.title}
                  aria-label={`Source ${n}: ${source.title}`}
                  className="ml-0.5 inline-flex size-4 -translate-y-0.5 items-center justify-center bg-accent-soft text-step-0 text-accent no-underline hover:bg-accent hover:text-bg"
                >
                  {n}
                </Link>
              );
            })}
          </span>
        );
      })}
    </>
  );
}

export function Answer({ text, sources, onNavigate }: Props) {
  const blocks = text.trim().split(/\n{2,}/);
  const props = { sources, onNavigate };

  return (
    <div className="space-y-3">
      {blocks.map((block, b) => {
        // Group consecutive list lines; other lines form paragraphs.
        const groups: { kind: "p" | "ul" | "ol"; lines: string[] }[] = [];
        for (const line of block.split("\n")) {
          const kind = /^\s*[-*]\s+/.test(line) ? "ul" : /^\s*\d+[.)]\s+/.test(line) ? "ol" : "p";
          const content = line.replace(/^\s*(?:[-*]|\d+[.)])\s+/, "");
          const last = groups[groups.length - 1];
          if (last && last.kind === kind) last.lines.push(content);
          else groups.push({ kind, lines: [content] });
        }
        return groups.map((g, i) => {
          const key = `${b}-${i}`;
          if (g.kind === "p") {
            return (
              <p key={key}>
                <Inline text={g.lines.join(" ")} {...props} />
              </p>
            );
          }
          const List = g.kind;
          return (
            <List key={key} className={`${g.kind === "ul" ? "list-disc" : "list-decimal"} space-y-1.5 pl-5 marker:text-accent`}>
              {g.lines.map((line, j) => (
                <li key={j}>
                  <Inline text={line} {...props} />
                </li>
              ))}
            </List>
          );
        });
      })}
    </div>
  );
}

/** Sources actually cited in the answer, in citation order. */
export function citedSources(text: string, sources: Source[]) {
  const cited = new Set<number>();
  for (const m of text.matchAll(/\[(\d+(?:\s*,\s*\d+)*)\]/g)) {
    for (const n of m[1].split(",")) cited.add(Number(n.trim()));
  }
  return sources.filter((s) => cited.has(s.n));
}
