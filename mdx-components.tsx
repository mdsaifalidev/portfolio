import type { MDXComponents } from "mdx/types";
import Image from "next/image";
import Link from "next/link";
import { InsightFlowArchitecture } from "@/components/diagrams/InsightFlowArchitecture";
import { Callout, Figure, Metrics } from "@/components/mdx/Blocks";

// Typography lives in the `.article` styles in app/globals.css; this map only swaps
// in behaviour (anchors, links, images) and the custom blocks MDX files may use.
function heading(Tag: "h2" | "h3") {
  return function Heading({ id, children }: React.ComponentProps<"h2">) {
    return (
      <Tag id={id} className="group">
        {children}
        {id && (
          <a href={`#${id}`} aria-label="Link to this section" className="anchor">
            #
          </a>
        )}
      </Tag>
    );
  };
}

const components: MDXComponents = {
  h2: heading("h2"),
  h3: heading("h3"),
  a: ({ href = "", children, ...props }) =>
    href.startsWith("/") || href.startsWith("#") ? (
      <Link href={href} {...props}>
        {children}
      </Link>
    ) : (
      <a href={href} target="_blank" rel="noreferrer noopener" {...props}>
        {children}
      </a>
    ),
  img: ({ src, alt = "" }) => (
    <Image src={src as string} alt={alt} width={1280} height={800} className="rounded-lg border border-border" />
  ),
  table: (props) => (
    <div className="table-wrap">
      <table {...props} />
    </div>
  ),
  Callout,
  Figure,
  Metrics,
  InsightFlowArchitecture,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
