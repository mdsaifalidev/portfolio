import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Page not found" };

const places = [
  { href: "/#work", label: "Selected work" },
  { href: "/#experience", label: "Experience" },
  { href: "/#contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <main id="content" className="mx-auto flex min-h-svh max-w-3xl flex-col justify-center px-5 py-24 sm:px-8">
      <p className="condensed text-step-5">404</p>
      <h1 className="mt-6 text-step-3 leading-none font-bold tracking-[-0.03em] text-text">This page doesn&apos;t exist.</h1>
      <p className="mt-5 max-w-[48ch]">It may have moved, or the link might be mistyped. Here are some places to start:</p>
      <ul className="mt-8 space-y-3 font-semibold">
        <li>
          <Link href="/" className="pressable link inline-flex items-center gap-2">
            <ArrowLeft className="size-4" aria-hidden="true" />
            Home
          </Link>
        </li>
        {places.map((p) => (
          <li key={p.href}>
            <Link href={p.href} className="pressable link">
              {p.label}
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
