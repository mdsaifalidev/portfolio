import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { posts, type Post } from "@/content/posts";
import { navSections, platforms, projects, type NavItem, type Platform, type Project } from "@/content/profile";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** Drafts are visible in development only. */
export function isVisible(item: { draft?: boolean }) {
  return !item.draft || process.env.NODE_ENV !== "production";
}

/** A platform's case study, in the same shape as a project's so one page template renders both. */
export function platformAsProject(p: Platform): Project {
  return {
    slug: p.slug,
    title: p.name,
    summary: p.tagline,
    highlights: [...(p.metric ? [p.metric] : []), ...p.decisions].slice(0, 3),
    tags: p.stack,
    kind: "work",
    caseStudy: Boolean(p.caseStudy),
    // A write-up is a draft if either the platform or its case study is.
    draft: Boolean(p.draft || p.caseStudy?.draft),
  };
}

/** Every case study (projects + platforms), regardless of draft state. */
export function allCaseStudyEntries(): Project[] {
  return [...projects.filter((p) => p.caseStudy), ...platforms.filter((p) => p.caseStudy).map(platformAsProject)];
}

export function getCaseStudies(): Project[] {
  return allCaseStudyEntries().filter(isVisible);
}

export function getPlatforms(): Platform[] {
  return platforms.filter(isVisible);
}

/** Home-page sections that have something to show (e.g. Writing appears once a post is visible). */
export function getNavSections(): NavItem[] {
  const hidden = new Set<string>();
  if (getPosts().length === 0) hidden.add("writing");
  if (getPlatforms().length === 0) hidden.add("platforms");
  return navSections.filter((s) => !hidden.has(s.id));
}

export function getCaseStudy(slug: string): Project | undefined {
  return getCaseStudies().find((p) => p.slug === slug);
}

export function hasCaseStudy(project: Project) {
  return Boolean(project.caseStudy && isVisible(project));
}

export function platformCaseStudyHref(platform: Platform) {
  return platform.caseStudy && hasCaseStudy(platformAsProject(platform)) ? `/projects/${platform.slug}` : undefined;
}

export function getPosts(): Post[] {
  return posts.filter(isVisible).sort((a, b) => b.date.localeCompare(a.date));
}

export function getPost(slug: string): Post | undefined {
  return getPosts().find((p) => p.slug === slug);
}

function readSource(kind: "projects" | "blog", slug: string) {
  return fs.readFileSync(path.join(CONTENT_DIR, kind, `${slug}.mdx`), "utf8");
}

/** Strip code fences, JSX and MDX comments so they don't inflate word counts or headings. */
export function prose(source: string) {
  return source
    .replace(/\r\n/g, "\n")
    .replace(/\r/g, "\n")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<[^>]+>/g, "");
}

export function readingTime(kind: "projects" | "blog", slug: string) {
  const words = prose(readSource(kind, slug)).split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}

export type Heading = { id: string; text: string; depth: 2 | 3 };

/** Mirrors rehype-slug (github-slugger) so ToC links match rendered heading ids. */
export function getHeadings(kind: "projects" | "blog", slug: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  for (const line of prose(readSource(kind, slug)).split("\n")) {
    const match = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (!match) continue;
    const text = match[2].replace(/[*_`]/g, "");
    headings.push({ id: slugger.slug(text), text, depth: match[1].length as 2 | 3 });
  }
  return headings;
}

export function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
