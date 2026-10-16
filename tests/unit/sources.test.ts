import { describe, expect, it } from "vitest";
import { posts } from "@/content/posts";
import { navSections, platforms, projects } from "@/content/profile";
import { allCaseStudyEntries, getHeadings } from "@/lib/content";
import { buildChunks } from "@/lib/rag/sources";

const chunks = buildChunks();

describe("assistant knowledge base", () => {
  it("has unique chunk ids", () => {
    const ids = chunks.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("never indexes draft case studies or posts", () => {
    const draftProjects = allCaseStudyEntries().filter((p) => p.draft).map((p) => p.slug);
    const draftPosts = posts.filter((p) => p.draft).map((p) => p.slug);
    for (const chunk of chunks) {
      for (const slug of draftProjects) expect(chunk.id.startsWith(`projects-${slug}-`)).toBe(false);
      for (const slug of draftPosts) expect(chunk.id.startsWith(`blog-${slug}-`)).toBe(false);
      expect(chunk.text).not.toContain("TODO(Saif)");
    }
  });

  it("links every chunk to a real section or published page anchor", () => {
    const sections = new Set(navSections.map((s) => s.id));
    const published = new Set(allCaseStudyEntries().filter((p) => !p.draft).map((p) => p.slug));

    for (const { url, id } of chunks) {
      const home = /^\/#([\w-]+)$/.exec(url);
      if (home) {
        expect(sections.has(home[1]), `${id} -> ${url}`).toBe(true);
        continue;
      }
      const page = /^\/projects\/([\w-]+)(?:#([\w-]+))?$/.exec(url);
      expect(page, `${id} has unexpected url ${url}`).not.toBeNull();
      const [, slug, anchor] = page!;
      expect(published.has(slug), `${id} links to unpublished ${slug}`).toBe(true);
      if (anchor) {
        const ids = getHeadings("projects", slug).map((h) => h.id);
        expect(ids, `${id} -> #${anchor}`).toContain(anchor);
      }
    }
  });

  it("covers the core profile facts", () => {
    const ids = chunks.map((c) => c.id);
    expect(ids).toEqual(expect.arrayContaining(["profile", "about", "capabilities", "education", "experience-0"]));
    expect(chunks.find((c) => c.id === "experience-0")?.text).toMatch(/current job/i);
  });

  it("indexes only published HashCash platforms", () => {
    for (const p of platforms) {
      expect(chunks.some((c) => c.id === `platform-${p.slug}`), p.slug).toBe(!p.draft);
    }
    expect(projects.some((p) => p.slug === "rag-mcp-platform")).toBe(false);
  });
});
