import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { McpDiagram, RagDiagram } from "@/components/diagrams/PlatformDiagrams";
import { ProjectBadges, ProjectHighlights, ProjectLinks } from "@/components/projects/ProjectMeta";
import { experience, projects, type Platform, type Project } from "@/content/profile";
import { Rich } from "@/components/ui/Rich";
import { getPlatforms, hasCaseStudy, isVisible, platformCaseStudyHref } from "@/lib/content";
import { cn } from "@/lib/utils";

const company = experience.find((job) => job.end === "Present")?.company ?? "HashCash Consultants LLC";
const diagrams: Record<string, () => React.ReactElement> = {
  "multi-tenant-rag": RagDiagram,
  "mcp-knowledge-server": McpDiagram,
};

type Folder = {
  key: string;
  /** Anchor for the first folder of a group (#platforms, #projects). */
  anchor?: string;
  title: string;
  category: string;
  /** The one-sentence summary; set large when the folder has no picture. */
  lead: string;
  details: React.ReactNode;
  picture: React.ReactNode;
};

function platformFolder(p: Platform, anchor?: string): Folder {
  const Diagram = diagrams[p.slug];
  const href = platformCaseStudyHref(p);
  return {
    key: p.slug,
    anchor,
    title: p.name,
    category: `Platform at ${company}`,
    picture: Diagram ? (
      <div className="bg-sheet p-5 sm:p-8">
        <Diagram />
      </div>
    ) : null,
    lead: p.tagline,
    details: (
      <>
        <ul className="space-y-2">
          {[...p.contribution, ...p.decisions].map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
        {p.metric && (
          <p className="mt-5 text-step-2 leading-tight">
            <Rich text={p.metric} />
          </p>
        )}
        {p.stack.length > 0 && <p className="mt-5 text-step-0 text-muted">{p.stack.join(", ")}</p>}
        {href && (
          <Link href={href} className="pressable link mt-5 inline-flex items-center gap-1 font-semibold">
            Read the case study
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        )}
      </>
    ),
  };
}

function projectFolder(p: Project, anchor?: string): Folder {
  const caseStudy = hasCaseStudy(p) ? `/projects/${p.slug}` : undefined;
  return {
    key: p.slug,
    anchor,
    title: p.title,
    category: p.kind === "work" ? "Professional project" : "Personal project",
    picture: p.image ? (
      <Image
        src={p.image}
        alt={`Screenshot of ${p.title}`}
        width={1280}
        height={800}
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="aspect-[16/10] h-auto w-full object-cover object-top"
      />
    ) : null,
    lead: p.summary,
    details: (
      <>
        <ProjectBadges project={p} />
        <ProjectHighlights project={p} />
        <p className="mt-5 text-step-0 text-muted">{p.tags.join(", ")}</p>
        <ProjectLinks project={p} className="mt-6">
          {caseStudy && (
            <Link href={caseStudy} className="pressable link inline-flex items-center gap-1">
              Read the case study
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          )}
        </ProjectLinks>
      </>
    ),
  };
}

/**
 * Work filed as folders: full-width bands, each led by a shouldered tab, platforms first, then projects.
 */
export function Work() {
  const folders: Folder[] = [
    ...getPlatforms().map((p, i) => platformFolder(p, i === 0 ? "platforms" : undefined)),
    ...projects.filter(isVisible).map((p, i) => projectFolder(p, i === 0 ? "projects" : undefined)),
  ];

  return (
    <section id="work" aria-labelledby="work-heading" className="scroll-mt-4 pt-28 lg:pt-40">
      <div data-reveal className="mx-auto max-w-[90rem] px-5 sm:px-8 lg:px-12">
        <h2 id="work-heading" className="condensed part-title">
          Selected work
        </h2>
        <p className="mt-5 max-w-[56ch] text-step-1">
          Two platforms I built with the team at {company} (product names withheld under company policy), then
          the projects I designed and shipped on my own.
        </p>
      </div>

      <div className="mt-16">
        {folders.map((f, i) => {
          const ink = i % 2 === 1;
          return (
            <article
              key={f.key}
              id={f.anchor}
              aria-labelledby={`folder-${f.key}`}
              className="scroll-mt-4"
            >
              {/* The tab: a shouldered shape rising from the band's top edge. */}
              <div
                className={cn(
                  "ml-5 w-fit max-w-[calc(100%-2.5rem)] px-6 pt-2.5 pb-1 [clip-path:polygon(0_100%,0.75rem_0,calc(100%-0.75rem)_0,100%_100%)] sm:ml-8 lg:ml-12",
                  ink ? "ink-field" : "bg-surface",
                )}
              >
                <h3 id={`folder-${f.key}`} className="text-step-2 leading-tight font-bold tracking-[-0.015em] text-balance">
                  {f.title}
                </h3>
              </div>
              <div className={ink ? "ink-field" : "bg-surface"}>
                <div className="mx-auto max-w-[90rem] px-5 pt-3 pb-14 sm:px-8 lg:px-12 lg:pb-24">
                  <p className="text-step-0 text-muted lg:text-right">{f.category}</p>
                  {f.picture ? (
                    <div data-reveal className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-6">
                      <div className="lg:col-span-7">{f.picture}</div>
                      <div className="max-w-[60ch] lg:col-span-4 lg:col-start-9">
                        <p className="mb-5">{f.lead}</p>
                        {f.details}
                      </div>
                    </div>
                  ) : (
                    // No picture: the summary itself is set large and takes the picture's place.
                    <div data-reveal className="mt-6 grid gap-8 lg:mt-8 lg:grid-cols-12 lg:gap-6">
                      <p className="text-step-2 leading-[1.15] tracking-[-0.015em] lg:col-span-7">{f.lead}</p>
                      <div className="max-w-[60ch] lg:col-span-4 lg:col-start-9">{f.details}</div>
                    </div>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
