import type { MetadataRoute } from "next";
import { getCaseStudies, getPosts } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

// Only published content: in production builds getCaseStudies/getPosts already exclude drafts.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const posts = getPosts();

  return [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absoluteUrl("/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    ...getCaseStudies().map((p) => ({
      url: absoluteUrl(`/projects/${p.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...(posts.length > 0 ? [{ url: absoluteUrl("/blog"), lastModified: now, changeFrequency: "weekly" as const, priority: 0.6 }] : []),
    ...posts.map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(`${p.date}T00:00:00Z`),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
