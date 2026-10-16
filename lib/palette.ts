import { profile, projects } from "@/content/profile";
import { getNavSections, getPlatforms, getPosts, hasCaseStudy, platformCaseStudyHref } from "@/lib/content";

export type PaletteItem = {
  id: string;
  group: "Navigate" | "Projects" | "Writing" | "Links";
  label: string;
  hint?: string;
  href: string;
  external?: boolean;
  keywords?: string[];
};

/** Built on the server (drafts follow the usual dev/prod visibility) and passed to the palette as props. */
export function buildPaletteItems(): PaletteItem[] {
  const posts = getPosts();
  const items: PaletteItem[] = getNavSections().map((s) => ({
    id: `nav-${s.id}`,
    group: "Navigate",
    label: s.label,
    hint: "Section",
    href: `/#${s.id}`,
  }));

  if (posts.length > 0) {
    items.push({ id: "nav-blog", group: "Navigate", label: "All posts", hint: "Page", href: "/blog" });
  }

  for (const p of getPlatforms()) {
    const href = platformCaseStudyHref(p);
    items.push({
      id: `platform-${p.slug}`,
      group: "Projects",
      label: p.name,
      hint: href ? "Case study" : "Platform",
      href: href ?? "/#platforms",
      keywords: [...p.stack, "hashcash", "platform"],
    });
  }

  for (const p of projects) {
    const caseStudy = hasCaseStudy(p);
    const href = caseStudy ? `/projects/${p.slug}` : (p.live ?? p.code?.[0]?.href);
    if (!href) {
      items.push({ id: `project-${p.slug}`, group: "Projects", label: p.title, hint: "Project", href: "/#projects", keywords: p.tags });
      continue;
    }
    items.push({
      id: `project-${p.slug}`,
      group: "Projects",
      label: p.title,
      hint: caseStudy ? "Case study" : p.live ? "Live site" : "Code",
      href,
      external: !caseStudy,
      keywords: p.tags,
    });
  }

  for (const post of posts) {
    items.push({ id: `post-${post.slug}`, group: "Writing", label: post.title, hint: "Post", href: `/blog/${post.slug}`, keywords: post.tags });
  }

  items.push(
    { id: "link-linkedin", group: "Links", label: "LinkedIn", href: profile.linkedin, external: true },
    { id: "link-github", group: "Links", label: "GitHub", href: profile.github, external: true },
  );
  return items;
}
