import { formatDate, getPost, getPosts } from "@/lib/content";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = "Blog post";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getPost(slug);
  return ogImage({
    label: post ? `Writing | ${formatDate(post.date)}` : "Writing",
    title: post?.title ?? "Writing",
    subtitle: post?.summary,
    chips: post?.tags.slice(0, 4),
  });
}
