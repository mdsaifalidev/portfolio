import { ArrowLeft, ArrowUpRight, PencilLine } from "lucide-react";
import Link from "next/link";
import { profile } from "@/content/profile";
import type { Heading } from "@/lib/content";
import { Toc } from "./Toc";

/** Shared page frame for case studies and blog posts. */
export function ArticleShell({
  back,
  header,
  headings,
  draft,
  children,
}: {
  back: { href: string; label: string };
  header: React.ReactNode;
  headings: Heading[];
  draft?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto min-h-svh max-w-7xl px-5 pt-12 pb-32 sm:px-8 md:pt-20 lg:px-24">
      <div className="flex items-center gap-5">
        <Link
          href={back.href}
          className="group inline-flex items-center gap-2 text-step-0 font-medium text-text hover:text-accent"
        >
          <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
          {back.label}
        </Link>
      </div>

      {draft && (
        <p className="mt-8 flex max-w-[68ch] items-start gap-3 bg-warn/10 p-4 text-text">
          <PencilLine className="mt-0.5 size-4 shrink-0 text-warn" aria-hidden="true" />
          <span>
            <strong className="font-semibold">Draft, pending review.</strong> Only visible in development.
            Set <code className="">draft: false</code> once the content is checked.
          </span>
        </p>
      )}

      <div className="mt-10 xl:grid xl:grid-cols-[minmax(0,1fr)_15rem] xl:gap-16">
        <main id="content" className="min-w-0 max-w-[68ch]">
          {header}
          <div className="article mt-12">{children}</div>

          <footer className="mt-20 bg-surface px-6 py-8 sm:px-8">
            <p className="text-step-2 font-semibold tracking-[-0.015em] text-text">Want to talk about this?</p>
            <p className="mt-2">I&apos;m open to full-stack, backend and AI engineering roles, remote or with relocation.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3 font-semibold">
              <a href={`mailto:${profile.email}`} className="pressable inline-flex min-h-12 items-center gap-2 bg-accent px-5 text-accent-ink hover:opacity-90">
                {profile.email}
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
              <Link href={back.href} className="pressable link">
                Back to {back.label}
              </Link>
            </div>
          </footer>
        </main>

        {headings.length > 0 && (
          <aside className="hidden xl:block">
            <div className="sticky top-24">
              <Toc headings={headings} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
