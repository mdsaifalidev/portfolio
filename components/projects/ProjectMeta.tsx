import { ArrowUpRight } from "lucide-react";
import { GitHubIcon } from "@/components/icons";
import type { Project } from "@/content/profile";
import { Rich } from "@/components/ui/Rich";
import { cn } from "@/lib/utils";

/** A short note in the folder's meta line, e.g. "Featured project". */
export function ProjectBadges({ project }: { project: Project }) {
  const notes = [
    project.featured && "Featured project",
    project.kind === "work" && "Professional work, details anonymised",
    project.status === "in-progress" && "In progress",
  ].filter(Boolean) as string[];

  if (!notes.length) return null;
  return <p className="mb-4 text-step-0 text-muted">{notes.join(" | ")}</p>;
}

/** Measured results, set like a datasheet's key specifications. */
export function ProjectHighlights({ project, className }: { project: Project; className?: string }) {
  return (
    <ul className={cn("num space-y-1.5 text-text", className)} aria-label="Highlights">
      {project.highlights.map((h) => (
        <li key={h}>
          <Rich text={h} />
        </li>
      ))}
    </ul>
  );
}

/** Live site / source links. `children` lets callers prepend extra links (e.g. "Read case study"). */
export function ProjectLinks({
  project,
  className,
  children,
}: {
  project: Project;
  className?: string;
  children?: React.ReactNode;
}) {
  if (!children && !project.live && !project.code) return null;
  return (
    <div className={cn("flex flex-wrap gap-x-6 gap-y-2 font-semibold", className)}>
      {children}
      {project.live && (
        <a
          href={project.live}
          target="_blank"
          rel="noreferrer noopener"
          data-track="project_link_click"
          data-track-label={`${project.title}: live`}
          className="pressable link inline-flex items-center gap-1"
        >
          Live site
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </a>
      )}
      {project.code?.map((c) => (
        <a
          key={c.href}
          href={c.href}
          target="_blank"
          rel="noreferrer noopener"
          data-track="project_link_click"
          data-track-label={`${project.title}: ${c.label.toLowerCase()}`}
          className="pressable link inline-flex items-center gap-1.5"
        >
          <GitHubIcon className="size-4" />
          {c.label}
        </a>
      ))}
    </div>
  );
}
