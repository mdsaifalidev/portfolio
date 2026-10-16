// Builds the assistant's knowledge base from published site content.
// Drafts are always excluded, regardless of NODE_ENV, so the assistant never cites unreviewed text.
import fs from "node:fs";
import path from "node:path";
import GithubSlugger from "github-slugger";
import { posts } from "@/content/posts";
import {
  about,
  capabilities,
  certifications,
  education,
  experience,
  platforms,
  profile,
  projects,
} from "@/content/profile";
import { allCaseStudyEntries, prose } from "@/lib/content";

export type Chunk = { id: string; title: string; url: string; text: string };

const MAX_CHARS = 1800;
const plain = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1");

function profileChunks(): Chunk[] {
  const chunks: Chunk[] = [
    {
      id: "profile",
      title: "Profile & availability",
      url: "/#about",
      text: [
        `${profile.name} is a ${profile.role} with 3+ years of experience, based in ${profile.location} (${profile.timezone}).`,
        `Headline: ${profile.headline}`,
        `Availability: ${profile.availability}. He is open to full-stack, backend (Node.js) and AI / GenAI engineering roles, remote or with relocation.`,
        `Current role: ${experience[0].role} at ${experience[0].company} (${experience[0].start} - ${experience[0].end}).`,
        `Contact: email ${profile.email}; LinkedIn ${profile.linkedin}; GitHub ${profile.github}; resume (PDF) at ${profile.resume}.`,
      ].join("\n"),
    },
    { id: "about", title: "About", url: "/#about", text: about.map(plain).join("\n\n") },
  ];

  experience.forEach((job, i) => {
    chunks.push({
      id: `experience-${i}`,
      title: `${job.role} | ${job.company}`,
      url: "/#experience",
      text: [
        job.end === "Present"
          ? `Saif's current job (work experience): ${job.role} at ${job.company}, ${job.location}, since ${job.start}.`
          : `Saif's past work experience: ${job.role} at ${job.company}, ${job.location}, ${job.start} - ${job.end}.`,
        "What he did there:",
        ...job.bullets.map((b) => `- ${plain(b)}`),
        `Technologies: ${job.tags.join(", ")}.`,
      ].join("\n"),
    });
  });

  for (const p of projects) {
    const links = [
      p.live && `Live site: ${p.live}`,
      ...(p.code ?? []).map((c) => `${c.label} source: ${c.href}`),
    ].filter(Boolean);
    chunks.push({
      id: `project-${p.slug}`,
      title: p.title,
      // Only link to case studies that are published.
      url: p.caseStudy && !p.draft ? `/projects/${p.slug}` : "/#projects",
      text: [
        p.kind === "work"
          ? `Project Saif built at work (details anonymised): ${p.title}.`
          : `Personal project Saif built: ${p.title}.`,
        p.summary,
        ...p.highlights.map((h) => `- ${plain(h)}`),
        `Technologies: ${p.tags.join(", ")}.`,
        ...links,
      ].join("\n"),
    });
  }

  for (const p of platforms.filter((p) => !p.draft)) {
    chunks.push({
      id: `platform-${p.slug}`,
      title: `${p.name} (HashCash platform)`,
      url: p.caseStudy && !p.caseStudy.draft ? `/projects/${p.slug}` : "/#platforms",
      text: [
        `Platform Saif worked on at ${experience[0].company} (product name withheld): ${p.name}. ${p.tagline}`,
        "What Saif did:",
        ...p.contribution.map((c) => `- ${plain(c)}`),
        "Engineering decisions:",
        ...p.decisions.map((d) => `- ${plain(d)}`),
        ...(p.metric ? [`Result: ${plain(p.metric)}.`] : []),
        ...(p.stack.length ? [`Technologies: ${p.stack.join(", ")}.`] : []),
      ].join("\n"),
    });
  }

  chunks.push({
    id: "capabilities",
    title: "Capabilities & skills",
    url: "/#capabilities",
    text: capabilities
      .map((c) => {
        const shipped = c.evidence.filter((e) => !e.draft).map((e) => e.text);
        return `${c.domain}: ${shipped.length ? `shipped ${shipped.join("; ")}. ` : ""}Tools: ${c.tools.join(", ")}.`;
      })
      .join("\n"),
  });

  chunks.push({
    id: "education",
    title: "Education & certifications",
    url: "/#experience",
    text: [
      `${education.degree}, ${education.school}, ${education.start} - ${education.end}.`,
      ...certifications.map((c) => `Certification: ${c.label} (${c.issuer}) - ${c.href}`),
    ].join("\n"),
  });

  return chunks;
}

/** Split a long section on paragraph boundaries so each chunk stays focused. */
function split(text: string): string[] {
  if (text.length <= MAX_CHARS) return [text];
  const parts: string[] = [];
  let current = "";
  for (const para of text.split(/\n{2,}/)) {
    if (current && current.length + para.length > MAX_CHARS) {
      parts.push(current);
      current = "";
    }
    current = current ? `${current}\n\n${para}` : para;
  }
  if (current) parts.push(current);
  return parts;
}

function mdxChunks(kind: "projects" | "blog", slug: string, docTitle: string): Chunk[] {
  const source = fs.readFileSync(path.join(process.cwd(), "content", kind, `${slug}.mdx`), "utf8");
  const base = kind === "projects" ? `/projects/${slug}` : `/blog/${slug}`;
  const slugger = new GithubSlugger();
  const chunks: Chunk[] = [];

  // Sections start at each "## " heading; "### " stays inside its section but still
  // advances the slugger so ids match rehype-slug's output.
  let heading = "Overview";
  let anchor = "";
  let body: string[] = [];
  const flush = () => {
    const text = body.join("\n").replace(/\n{3,}/g, "\n\n").trim();
    split(text).forEach((part, i) => {
      if (!part) return;
      chunks.push({
        id: `${kind}-${slug}-${anchor || "intro"}${i ? `-${i}` : ""}`,
        title: `${docTitle} - ${heading}`,
        url: anchor ? `${base}#${anchor}` : base,
        text: part,
      });
    });
  };

  for (const line of prose(source).split("\n")) {
    const h = /^(#{2,3})\s+(.+?)\s*$/.exec(line);
    if (h) {
      const text = h[2].replace(/[*_`]/g, "");
      const id = slugger.slug(text);
      if (h[1] === "##") {
        flush();
        heading = text;
        anchor = id;
        body = [];
        continue;
      }
    }
    body.push(line);
  }
  flush();
  return chunks;
}

export function buildChunks(): Chunk[] {
  const chunks = profileChunks();
  for (const p of allCaseStudyEntries().filter((p) => !p.draft)) {
    chunks.push(...mdxChunks("projects", p.slug, `${p.title} case study`));
  }
  for (const post of posts.filter((p) => !p.draft)) {
    chunks.push(...mdxChunks("blog", post.slug, post.title));
  }
  // Normalize line endings to LF so hash is deterministic across Windows and Linux (CI)
  return chunks.map((c) => ({
    ...c,
    text: c.text.replace(/\r\n/g, "\n").replace(/\r/g, "\n"),
  }));
}

