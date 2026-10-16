import { ArrowLeft, Rss } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { formatDate, getPosts, readingTime } from "@/lib/content";

export const metadata: Metadata = {
  title: "Writing",
  description: "Notes on backend engineering, microservices and building production AI systems.",
  alternates: { canonical: "/blog" },
};

export default function BlogIndex() {
  const posts = getPosts();

  return (
    <div className="mx-auto min-h-svh max-w-3xl px-5 pt-12 pb-32 sm:px-8 md:pt-20">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-step-0 font-medium text-text hover:text-accent"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        Md. Saif Ali
      </Link>

      <main id="content">
        <div className="mt-10 flex items-end justify-between gap-4">
          <h1 className="text-step-4 leading-[0.95] font-bold tracking-[-0.035em] text-text">Writing</h1>
          <a href="/blog/rss.xml" className="inline-flex items-center gap-1.5 text-step-0 hover:text-accent">
            <Rss className="size-3.5" aria-hidden="true" />
            RSS
          </a>
        </div>
        <p className="mt-4">Notes on backend engineering, microservices and building production AI systems.</p>

        {posts.length === 0 ? (
          <p className="mt-16 bg-surface p-8">
            The first posts are on their way. Meanwhile, the{" "}
            <Link href="/projects/insightflow" className="link">
              InsightFlow case study
            </Link>{" "}
            goes deep on architecture and benchmarks.
          </p>
        ) : (
          <ul className="mt-16 space-y-2">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link href={`/blog/${post.slug}`} className="pressable group block bg-surface px-5 py-6">
                  <span className="num block text-step-0 text-muted">
                    <time dateTime={post.date}>{formatDate(post.date)}</time> | {readingTime("blog", post.slug)} min read
                    {post.draft && <span className="ml-2 font-semibold text-warn">Draft</span>}
                  </span>
                  <span className="mt-2 block text-step-2 leading-tight font-semibold tracking-[-0.015em] text-text group-hover:text-accent">
                    {post.title}
                  </span>
                  <span className="mt-2 block">{post.summary}</span>
                  <span className="mt-3 block text-step-0 text-muted">{post.tags.join(", ")}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
