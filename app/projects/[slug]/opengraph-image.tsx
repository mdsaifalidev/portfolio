import { getCaseStudies, getCaseStudy } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Case study";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getCaseStudies().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = getCaseStudy(slug);
  return ogImage({
    label: "Case study",
    title: project?.title ?? "Case study",
    subtitle: project?.summary,
    chips: project?.tags.slice(0, 4),
  });
}
