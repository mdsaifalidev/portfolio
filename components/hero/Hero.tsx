import Image from "next/image";
import { experience, profile } from "@/content/profile";
import heroPhoto from "@/public/photos/steel-truss.jpg";
import { AskField } from "./AskField";

const current = experience.find((job) => job.end === "Present");

/**
 * The first screen is the datasheet itself: one paper sheet laid over a dim photograph of a steel
 * truss. The part title (the name) runs across its top edge, the facts sit under it, and its
 * bottom edge carries the live question field. On wide screens the sheet shrinks toward the stub
 * (bottom-right) as the page scrolls.
 */
export function Hero() {
  return (
    <section aria-labelledby="hero-name" className="relative isolate flex min-h-svh items-center overflow-hidden px-4 py-20 sm:px-8">
      <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden bg-field">
        <Image
          src={heroPhoto}
          alt=""
          fill
          priority
          sizes="100vw"
          placeholder="blur"
          className="drift object-cover"
        />
        {/* A neutral scrim instead of a CSS filter, so the drift stays on the compositor. */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="sheet-away mx-auto w-full max-w-[64rem] bg-sheet px-5 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-8">
        <h1 id="hero-name" className="condensed flex flex-wrap justify-between gap-x-6 text-step-4 text-text">
          <span>Md.</span> <span>Saif</span> <span>Ali</span>
        </h1>

        <div className="mt-8 grid gap-6 sm:mt-10 md:grid-cols-[1fr_1fr] md:gap-10">
          <p className="text-step-2 leading-[1.08] font-semibold tracking-[-0.015em] text-text">
            <span className="block">{profile.role}</span>
            <span className="block">Durgapur, India (IST)</span>
            <span className="block font-bold">Open to remote or relocation</span>
          </p>
          <p className="max-w-[34ch] text-step-2 leading-[1.15] tracking-[-0.01em] text-text">
            I build Node.js backends and production AI systems: RAG, MCP and real-time.
          </p>
        </div>

        <div className="mt-10 grid items-end gap-6 sm:mt-12 md:grid-cols-[1fr_minmax(0,30rem)_1fr]">
          <p className="order-3 text-step-0 text-muted md:order-1">
            {current ? `${current.role} at ${current.company}` : profile.availability}
          </p>
          <div className="order-1 md:order-2">
            <AskField />
          </div>
          <a
            href={profile.resume}
            target="_blank"
            rel="noreferrer noopener"
            data-track="resume_download"
            data-track-label="hero"
            className="pressable link order-2 justify-self-start font-semibold md:order-3 md:justify-self-end"
          >
            Resume (PDF)
          </a>
        </div>
      </div>
    </section>
  );
}
