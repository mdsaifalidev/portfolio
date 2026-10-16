import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {};

// Plugins are referenced by name so Turbopack can serialise them (see the Next.js MDX guide).
const withMDX = createMDX({
  options: {
    remarkPlugins: ["remark-gfm"],
    rehypePlugins: [
      "rehype-slug",
      [
        "rehype-pretty-code",
        {
          // High-contrast light theme: plain github-light has token colours below WCAG AA on white.
          theme: { dark: "github-dark-dimmed", light: "github-light-high-contrast" },
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
