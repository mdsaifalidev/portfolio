import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticleShell } from "@/components/article/ArticleShell";
import { JsonLd, personRef } from "@/components/JsonLd";
import { TagList } from "@/components/ui/Tag";
import { profile } from "@/content/profile";
import { formatDate, getHeadings, getPost, getPosts, readingTime } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.summary,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.summary,
      publishedTime: post.date,
      authors: [profile.name],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const { default: Body } = await import(`@/content/blog/${slug}.mdx`);

  return (
    <ArticleShell
      back={{ href: "/blog", label: "All posts" }}
      headings={getHeadings("blog", slug)}
      draft={post.draft}
      header={
        <header>
          <JsonLd
            data={{
              "@context": "https://schema.org",
              "@type": "BlogPosting",
              headline: post.title,
              description: post.summary,
              datePublished: post.date,
              url: absoluteUrl(`/blog/${slug}`),
              image: absoluteUrl(`/blog/${slug}/opengraph-image`),
              keywords: post.tags.join(", "),
              author: personRef,
            }}
          />
          <p className="text-step-0">
            <time dateTime={post.date}>{formatDate(post.date)}</time> | {readingTime("blog", slug)} min read
          </p>
          <h1 className="mt-4 text-step-4 leading-[0.95] font-bold tracking-[-0.035em] text-text">{post.title}</h1>
          <p className="mt-6 max-w-[56ch] text-step-2 leading-[1.2] tracking-[-0.01em]">{post.summary}</p>
          <TagList tags={post.tags} label="Topics" />
        </header>
      }
    >
      <Body />
    </ArticleShell>
  );
}
