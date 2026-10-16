import { Info, Lightbulb, TriangleAlert } from "lucide-react";
import { Rich } from "@/components/ui/Rich";
import { cn } from "@/lib/utils";

const calloutStyles = {
  note: { Icon: Info, className: "border-border" },
  tip: { Icon: Lightbulb, className: "border-accent/40" },
  warning: { Icon: TriangleAlert, className: "border-warn/40" },
};

export function Callout({
  type = "note",
  title,
  children,
}: {
  type?: keyof typeof calloutStyles;
  title?: string;
  children: React.ReactNode;
}) {
  const { Icon, className } = calloutStyles[type];
  return (
    <aside className={cn("my-6 flex gap-3 border bg-surface p-4 text-sm leading-relaxed", className)}>
      <Icon className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
      <div>
        {title && <p className="mb-1 font-medium text-text">{title}</p>}
        <div className="[&>p]:m-0 [&>p+p]:mt-2">{children}</div>
      </div>
    </aside>
  );
}

/** Grid of headline numbers. `value` supports **metric** highlighting via <Rich>. */
export function Metrics({ items }: { items: { value: string; label: string }[] }) {
  return (
    <dl className="my-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
      {items.map((m) => (
        <div key={m.label} className="border border-border bg-surface p-4">
          <dt className="text-step-0">{m.label}</dt>
          <dd className="mt-1 text-xl font-semibold tracking-tight text-text">
            <Rich text={m.value} />
          </dd>
        </div>
      ))}
    </dl>
  );
}

export function Figure({ caption, children }: { caption?: string; children: React.ReactNode }) {
  return (
    <figure className="my-8">
      {children}
      {caption && <figcaption className="mt-3 text-center text-step-0">{caption}</figcaption>}
    </figure>
  );
}
