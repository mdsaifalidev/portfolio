import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import type { Source } from "@/lib/rag/types";

// next/link needs the app router at runtime; a plain anchor is enough to test the output.
vi.mock("next/link", () => ({
  default: ({ href, children, ...rest }: React.ComponentProps<"a"> & { href: string }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

const { Answer, citedSources } = await import("@/components/chat/Answer");

const sources: Source[] = [
  { n: 1, title: "InsightFlow", url: "/projects/insightflow" },
  { n: 2, title: "Profile", url: "/#about" },
  { n: 3, title: "Skills", url: "/#skills" },
];

const render = (text: string) => renderToStaticMarkup(<Answer text={text} sources={sources} onNavigate={() => {}} />);

describe("citedSources", () => {
  it("returns only cited sources, including comma lists, in source order", () => {
    expect(citedSources("Yes [2]. Also [1, 3].", sources).map((s) => s.n)).toEqual([1, 2, 3]);
    expect(citedSources("No citations here.", sources)).toEqual([]);
  });
});

describe("Answer rendering", () => {
  it("turns citations into links and drops unknown ones", () => {
    const html = render("Saif is based in India [2] [9].");
    expect(html).toContain('href="/#about"');
    expect(html).toContain('aria-label="Source 2: Profile"');
    expect(html).not.toContain("Source 9");
  });

  it("renders bold, lists and safe links", () => {
    const html = render("**Highlights**\n\n- Uses [Polars](https://pola.rs)\n- See https://example.com/demo.");
    expect(html).toContain("<strong");
    expect(html).toContain("<ul");
    expect(html).toContain('href="https://pola.rs"');
    // Trailing punctuation is not part of an autolinked URL.
    expect(html).toContain('href="https://example.com/demo"');
  });

  it("never renders javascript: links or raw HTML", () => {
    const html = render('Click [here](javascript:alert(1)) <img src=x onerror="alert(1)">');
    expect(html).not.toContain("javascript:");
    expect(html).not.toContain("<img");
    expect(html).toContain("&lt;img");
  });
});
