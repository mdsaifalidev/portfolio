import { cn } from "@/lib/utils";

/** Tools and topics as a plain line of text, the way a datasheet lists them. */
export function TagList({ tags, label, className }: { tags: string[]; label: string; className?: string }) {
  return (
    <p className={cn("mt-4 text-step-0 text-muted", className)}>
      <span className="sr-only">{label}: </span>
      {tags.join(", ")}
    </p>
  );
}
