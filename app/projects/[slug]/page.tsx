import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article/ArticleShell";
import { JsonLd, personRef } from "@/components/JsonLd";
import { ProjectBadges, ProjectHighlights, ProjectLinks } from "@/components/projects/ProjectMeta";
import { TagList } from "@/components/ui/Tag";
import { getCaseStudies, getCaseStudy, getHeadings, readingTime } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getCaseStudies().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) return {};
  return {
    title: `${project.title} - case study`,
    description: project.summary,
    alternates: { canonical: `/projects/${slug}` },
    openGraph: { type: "article", title: project.title, description: project.summary },
  };
}

export default async function CaseStudyPage({ params }: PageProps<"/projects/[slug]">) {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  if (!project) notFound();

  const { default: Body } = await import(`@/content/projects/${slug}.mdx`);

  return (
    <ArticleShell
      back={{ href: "/#projects", label: "All projects" }}
      headings={getHeadings("projects", slug)}
      draft={project.draft}
      header={
        <header>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "TechArticle",
              headline: `${project.title} - case study`,
              description: project.summary,
              url: absoluteUrl(`/projects/${slug}`),
              image: absoluteUrl(`/projects/${slug}/opengraph-image`),
              keywords: project.tags.join(", "),
              author: personRef,
            }}
          />
          <ProjectBadges project={project} />
          <p className="text-step-0">
            Case study | {readingTime("projects", slug)} min read
          </p>
          <h1 className="mt-4 text-step-4 leading-[0.95] font-bold tracking-[-0.035em] text-text">{project.title}</h1>
          <p className="mt-6 max-w-[56ch] text-step-2 leading-[1.2] tracking-[-0.01em]">{project.summary}</p>
          <ProjectHighlights project={project} className="mt-8 bg-surface px-5 py-4" />
          <ProjectLinks project={project} className="mt-6" />
          <TagList tags={project.tags} label={`Technologies used in ${project.title}`} />
          {project.image && (
            <Image
              src={project.image}
              alt={`Screenshot of ${project.title}`}
              width={1280}
              height={800}
              priority
              sizes="(min-width: 768px) 68ch, 100vw"
              className="mt-10"
            />
          )}
        </header>
      }
    >
      <Body />
    </ArticleShell>
  );
}
