import { about, profile } from "@/content/profile";
import { Avatar } from "@/components/layout/Avatar";
import { Rich } from "@/components/ui/Rich";

/** A letter from Saif on a paper sheet, with a tear-off strip carrying his email address. */
export function About() {
  return (
    <section id="about" aria-label="About Saif" className="ink-field scroll-mt-4 px-4 pt-28 pb-40 sm:px-8 lg:pt-40 lg:pb-48">
      <div data-reveal className="mx-auto max-w-[40rem]">
        <div className="bg-sheet px-6 pt-10 pb-10 text-[var(--page-ink)] sm:px-[60px] sm:pt-14">
          <Avatar size={112} />
          <div className="mt-7 space-y-5 leading-[1.6]">
            {about.map((paragraph, i) => (
              <p key={i}>
                <Rich text={paragraph} />
              </p>
            ))}
            <p>
              I work from Durgapur, on India Standard Time, and I am open to remote roles or relocating for the right
              team.
            </p>
          </div>
          <p className="condensed mt-9 text-step-3">{profile.name}</p>
          <p className="text-step-0 text-[var(--page-muted)]">{profile.role}</p>
        </div>

        <div className="edge-scallop bg-sheet text-[var(--page-ink)] [--edge:var(--sheet)]">
          <div className="perforation mx-6 text-[var(--page-muted)] sm:mx-[60px]" aria-hidden="true" />
          <a
            href={`mailto:${profile.email}`}
            className="pressable flex min-h-[72px] flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-4 font-semibold sm:px-[60px]"
          >
            <span>Write to me</span>
            <span className="link break-all">{profile.email}</span>
          </a>
        </div>
      </div>
    </section>
  );
}
