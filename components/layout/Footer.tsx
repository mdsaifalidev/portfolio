import Image from "next/image";
import Link from "next/link";
import { profile } from "@/content/profile";
import stamp from "@/public/photos/lattice-tower.jpg";

const address = [
  { label: profile.email, href: `mailto:${profile.email}` },
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
  { label: "Resume (PDF)", href: profile.resume },
];

/** The back of the datasheet, laid out like the back of a postcard: a message, an address, a stamp. */
export function Footer() {
  return (
    <footer className="ink-field px-4 pt-24 pb-28 sm:px-8 lg:pb-24">
      <div className="edge-scallop-top mx-auto max-w-[80rem] bg-sheet px-6 pt-10 pb-8 text-[var(--page-ink)] [--edge:var(--sheet)] sm:px-12 sm:pt-14">
        <div className="grid gap-12 md:grid-cols-2 md:gap-16">
          <div>
            <p className="text-step-2 leading-tight font-semibold tracking-[-0.02em]">Thanks for reading.</p>
            <p className="mt-4 max-w-[40ch]">
              If a role or a problem here sounds like yours, write to me. I read every message, and the assistant on this
              page can answer the quick questions in the meantime.
            </p>
          </div>
          <div className="relative">
            <div aria-hidden="true" className="absolute top-0 right-0 w-16 bg-[var(--sheet)] p-1.5 outline-2 outline-[var(--page-ink)] sm:w-[88px]">
              <Image src={stamp} alt="" sizes="88px" className="aspect-[3/4] h-auto w-full object-cover" />
            </div>
            <ul className="space-y-3 pr-24 font-semibold sm:pr-32">
              {address.map((a) => (
                <li key={a.label}>
                  <a
                    href={a.href}
                    {...(a.href.startsWith("http") || a.href.endsWith(".pdf") ? { target: "_blank", rel: "noreferrer noopener" } : {})}
                    className="pressable link break-all"
                  >
                    {a.label}
                  </a>
                </li>
              ))}
              <li className="font-normal">{profile.location}</li>
            </ul>
          </div>
        </div>

        <div className="mt-14 space-y-2 text-center text-step-0 text-[var(--page-muted)]">
          <p>
            © {new Date().getFullYear()} {profile.name} |{" "}
            <Link href="/privacy" className="link text-[var(--page-ink)]">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
