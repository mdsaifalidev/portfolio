import { profile } from "@/content/profile";
import { ogContentType, ogImage, ogSize } from "@/lib/og";

export const alt = `${profile.name} - ${profile.role}`;
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return ogImage({
    label: "Portfolio",
    title: profile.name,
    subtitle: profile.headline,
    chips: ["Node.js", "Microservices", "RAG / MCP", "Next.js"],
  });
}
