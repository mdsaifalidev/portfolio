import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Post } from "@/content/posts";
import { formatDate, readingTime } from "@/lib/content";

/** Application notes: the latest posts as large title rows. */
export function Writing({ posts }: { posts: Post[] }) {
  return (
    <section id="writing" aria-labelledby="writing-heading" className="mx-auto max-w-[90rem] scroll-mt-4 px-5 pt-28 pb-28 sm:px-8 lg:px-12 lg:pt-36 lg:pb-32">
      <h2 id="writing-heading" className="condensed part-title">
        Writing
      </h2>
      <ul data-reveal className="mt-12 space-y-2">
        {posts.slice(0, 3).map((post) => (
          <li key={post.slug}>
            <Link
              href={`/blog/${post.slug}`}
              className="pressable group grid gap-2 bg-surface px-5 py-6 sm:grid-cols-[1fr_auto] sm:items-baseline sm:gap-8"
            >
              <span>
                <span className="block text-step-2 leading-tight font-semibold tracking-[-0.015em] group-hover:text-accent">
                  {post.title}
                  {post.draft && <span className="ml-3 align-middle text-step-0 font-semibold text-warn">Draft</span>}
                </span>
                <span className="mt-2 block max-w-[70ch]">{post.summary}</span>
              </span>
              <span className="num text-step-0 text-muted">
                <time dateTime={post.date}>{formatDate(post.date)}</time> | {readingTime("blog", post.slug)} min read
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link href="/blog" className="pressable link mt-10 inline-flex items-center gap-1 font-semibold">
        All posts
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </section>
  );
}
