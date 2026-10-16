import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { AskAiButton } from "@/components/chat/AskAiButton";
import { profile } from "@/content/profile";
import bridge from "@/public/photos/arched-bridge.jpg";
import { ContactForm } from "./ContactForm";
import { CopyEmailButton } from "./CopyEmailButton";

const terms = [
  { term: "Roles", value: "Full-stack, backend, AI" },
  { term: "Work", value: "Remote or relocation" },
  { term: "Timezone", value: "IST, UTC+5:30" },
];

const links = [
  { label: "LinkedIn", href: profile.linkedin },
  { label: "GitHub", href: profile.github },
  { label: "Resume (PDF)", href: profile.resume },
];

/**
 * Ordering information: a visit card held on a photograph of an arched bridge, then the message form
 * on paper below it.
 */
export function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-heading" className="scroll-mt-0">
      <div className="relative isolate sm:min-h-[70svh] lg:min-h-[100svh]">
        <Image
          src={bridge}
          alt=""
          fill
          sizes="100vw"
          placeholder="blur"
          className="-z-10 hidden object-cover object-[50%_60%] sm:block"
        />
        {/* Phones: the photograph is its own band and the card follows it. */}
        <Image src={bridge} alt="" sizes="100vw" placeholder="blur" className="aspect-[4/3] w-full object-cover object-[50%_60%] sm:hidden" />
        <div className="relative mx-4 -mt-12 sm:absolute sm:inset-x-8 sm:bottom-0 sm:left-auto sm:mx-0 sm:mt-0 sm:w-[24rem] sm:translate-y-20 lg:top-[60px] lg:right-[60px] lg:bottom-auto lg:translate-y-0">
          <div data-reveal className="bg-sheet p-8 text-text">
            <h2 id="contact-heading" className="text-step-2 leading-tight font-light tracking-[-0.02em]">
              Write to Saif
            </h2>
            <p className="mt-4">
              Durgapur, West Bengal
              <br />
              India
            </p>
            <dl className="num mt-5 space-y-1.5">
              {terms.map((t) => (
                <div key={t.term} className="flex justify-between gap-4">
                  <dt className="text-muted">{t.term}</dt>
                  <dd className="text-right">{t.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-5 flex items-center justify-between gap-3">
              <span className="font-semibold break-all">{profile.email}</span>
              <CopyEmailButton email={profile.email} />
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="pressable -mx-8 -mb-8 mt-6 flex h-[52px] items-center justify-center gap-2 bg-accent font-semibold text-accent-ink hover:opacity-90 pointer-coarse:h-14"
            >
              Email Saif
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[90rem] px-5 pt-20 pb-28 sm:px-8 sm:pt-32 lg:px-12 lg:pt-28 lg:pb-36">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-6">
          <div data-reveal className="lg:col-span-4">
            <p className="text-step-2 leading-tight font-semibold tracking-[-0.015em]">Or send a message from here.</p>
            <p className="mt-4 max-w-[36ch]">It reaches the same inbox. If you would rather ask a question first, the assistant answers from my CV.</p>
            <AskAiButton variant="outline" label="Ask my AI first" className="mt-6" />
            <ul className="mt-10 space-y-2 font-semibold">
              {links.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    {...(l.href === profile.resume && { "data-track": "resume_download", "data-track-label": "contact" })}
                    className="pressable link inline-flex items-center gap-1"
                  >
                    {l.label}
                    <ArrowUpRight className="size-4" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </section>
  );
}
