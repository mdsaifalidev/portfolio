import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { profile } from "@/content/profile";

export const metadata: Metadata = {
  title: "Privacy",
  description: "What this site collects about visitors, and what it doesn't.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-16 md:py-24">
      <Link
        href="/"
        className="group inline-flex items-center gap-2 text-step-0 font-medium text-text hover:text-accent"
      >
        <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-0.5 motion-reduce:transition-none" aria-hidden="true" />
        {profile.name}
      </Link>

      <main id="content" className="article mt-10">
        <h1 className="text-step-4 leading-[0.95] font-bold tracking-[-0.035em] text-text">Privacy</h1>
        <p>This is a personal portfolio. It collects as little as possible, and nothing that identifies you.</p>

        <h2 id="visit-counters">Visit counters</h2>
        <p>Once per browser session, the site records an anonymous visit:</p>
        <ul>
          <li>a total visit count;</li>
          <li>
            an estimate of unique visitors, made by adding a salted hash of your IP address to a HyperLogLog counter - a
            data structure that can estimate how many distinct values it has seen but cannot list or recover them;
          </li>
          <li>your country, from the hosting provider&apos;s geolocation (country level only).</li>
        </ul>
        <p>
          No cookies are set, IP addresses are never stored, and nothing is kept per visitor. Automated traffic (bots,
          crawlers, monitoring tools) is not counted.
        </p>

        <h2 id="analytics">Analytics</h2>
        <p>
          The site uses Vercel Web Analytics and Speed Insights, which measure page views and performance without cookies
          and without tracking you across sites.
        </p>

        <h2 id="assistant-and-contact">AI assistant and contact form</h2>
        <p>
          Questions you ask the AI assistant are sent to Google&apos;s Gemini API to generate an answer and are not stored
          by this site. Rate limiting uses a hash of your IP address that expires automatically. Messages sent through the
          contact form are delivered to {profile.name} by email (via Resend) and are not stored by the site.
        </p>

        <h2 id="contact">Questions</h2>
        <p>
          Email <a href={`mailto:${profile.email}`}>{profile.email}</a>.
        </p>
      </main>
    </div>
  );
}
