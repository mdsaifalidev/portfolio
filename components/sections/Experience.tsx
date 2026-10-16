import { ArrowUpRight, Plus } from "lucide-react";
import { certifications, education, experience, profile } from "@/content/profile";
import { Rich } from "@/components/ui/Rich";

/**
 * The revision history: one giant word filling a reading column, then a stack of filled bars. Each bar
 * opens in place; the current role starts open.
 */
export function Experience() {
  return (
    <section id="experience" aria-labelledby="experience-heading" className="scroll-mt-4 px-5 pt-28 pb-28 sm:px-8 lg:pt-40 lg:pb-36">
      <div className="mx-auto max-w-[40rem] [container-type:inline-size]">
        <h2 id="experience-heading" className="condensed text-[min(21.5cqw,var(--text-step-5))] leading-[0.8]">
          Experience
        </h2>

        <ol className="mt-5 space-y-1.5">
          {experience.map((job, i) => {
            const current = job.end === "Present";
            return (
              <li key={`${job.company}-${job.start}`}>
                <details open={i === 0} className="group bg-surface">
                  <summary className="pressable flex min-h-14 items-center gap-4 px-[18px] py-3 hover:bg-[color-mix(in_srgb,var(--surface),var(--text)_6%)]">
                    <span className="flex-1 font-semibold">{job.company}</span>
                    <span className="num hidden text-step-0 text-muted sm:inline">
                      {job.start} to {current ? "now" : job.end}
                    </span>
                    <Plus
                      className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="log-body px-5 pt-1 pb-6">
                    <p className="flex flex-wrap justify-between gap-x-4 font-semibold">
                      <span>{job.role}</span>
                      <span className="num font-normal text-muted">
                        {job.location} | {job.start} to {current ? "now" : job.end}
                      </span>
                    </p>
                    <ul className="mt-4 space-y-3.5">
                      {job.bullets.map((bullet, j) => (
                        <li key={j}>
                          <Rich text={bullet} />
                        </li>
                      ))}
                    </ul>
                    <p className="mt-5 text-step-0 text-muted">{job.tags.join(", ")}</p>
                  </div>
                </details>
              </li>
            );
          })}

          <li>
            <details className="group bg-surface">
              <summary className="pressable flex min-h-14 items-center gap-4 px-[18px] py-3 hover:bg-[color-mix(in_srgb,var(--surface),var(--text)_6%)]">
                <span className="flex-1 font-semibold">Education and certification</span>
                <span className="num hidden text-step-0 text-muted sm:inline">
                  {education.start} to {education.end}
                </span>
                <Plus className="size-5 shrink-0 transition-transform duration-200 group-open:rotate-45 motion-reduce:transition-none" aria-hidden="true" />
              </summary>
              <div className="log-body space-y-3.5 px-5 pt-1 pb-6">
                <p className="flex flex-wrap justify-between gap-x-4">
                  <span className="font-semibold">{education.degree}</span>
                  <span className="num text-muted">
                    {education.start} to {education.end}
                  </span>
                </p>
                <p>{education.school}</p>
                {certifications.map((cert) => (
                  <p key={cert.href}>
                    <a href={cert.href} target="_blank" rel="noreferrer noopener" className="link">
                      {cert.label}
                    </a>{" "}
                    <span className="text-muted">({cert.issuer})</span>
                  </p>
                ))}
              </div>
            </details>
          </li>
        </ol>

        <a
          href={profile.resume}
          target="_blank"
          rel="noreferrer noopener"
          data-track="resume_download"
          data-track-label="experience"
          className="pressable mt-8 inline-flex min-h-12 items-center gap-2 bg-text px-5 font-semibold text-bg hover:opacity-90"
        >
          Download the resume (PDF)
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
