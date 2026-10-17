import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata, Viewport } from "next";
import { Archivo, Geist_Mono } from "next/font/google"; // Geist Mono: code blocks only, taste-skill-ignore
import { ChatLauncher } from "@/components/chat/ChatLauncher";
import { AnalyticsListener } from "@/components/AnalyticsListener";
import { Reveal } from "@/components/Reveal";
import { Stub } from "@/components/layout/Stub";
import { PaletteLauncher } from "@/components/palette/PaletteLauncher";
import { TelemetryBeacon } from "@/components/telemetry/Beacon";
import { profile } from "@/content/profile";
import { getNavSections } from "@/lib/content";
import { buildPaletteItems } from "@/lib/palette";
import { SITE_URL } from "@/lib/site";
import { LIVE_THEME_COLOR_ID, THEME_COLORS } from "@/lib/theme";
import "./globals.css";

// One family for the whole datasheet: Archivo's width axis gives the condensed part titles and the
// normal-width text from the same file.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
});

// Code blocks in case studies only. "optional" keeps the preloaded font and never shifts layout.
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "optional",
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "monospace"],
});

const description = `${profile.role} with 3+ years building Node.js backends, event-driven microservices and production AI systems (RAG, MCP). Open to remote and international roles.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} - ${profile.role}`,
    template: `%s | ${profile.name}`,
  },
  description,
  keywords: [
    "Md. Saif Ali",
    "Full-Stack Software Engineer",
    "Node.js Developer",
    "Backend Engineer",
    "AI Engineer",
    "GenAI Engineer",
    "RAG",
    "MCP",
    "Microservices",
    "Next.js",
    "Remote",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  alternates: {
    types: { "application/rss+xml": [{ url: "/blog/rss.xml", title: `${profile.name} - Writing` }] },
  },
  openGraph: {
    type: "website",
    title: `${profile.name} - ${profile.role}`,
    description,
    siteName: profile.name,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} - ${profile.role}`,
    description,
  },
  verification: {
    google: "PJsRTCvRYLYNRfzh9S_ccSz1cmkaWWIOJ91oAbsJ5dg",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: THEME_COLORS.light },
    { media: "(prefers-color-scheme: dark)", color: THEME_COLORS.dark },
  ],
  // Paint edge to edge on notched phones; the stub pads itself with env(safe-area-inset-bottom).
  viewportFit: "cover",
};

// Runs before first paint: saved choice wins, otherwise follow the OS, falling back to dark.
// It also prepends our own theme-color meta (no media query, so browsers prefer it) so the status bar /
// browser chrome follows the chosen theme; Next's per-scheme metas remain the no-JS fallback.
const themeScript = `(function(){try{var t=localStorage.getItem("theme");var d=t?t==="dark":!window.matchMedia("(prefers-color-scheme: light)").matches;document.documentElement.classList.toggle("dark",d);var m=document.createElement("meta");m.name="theme-color";m.id="${LIVE_THEME_COLOR_ID}";m.content=d?"${THEME_COLORS.dark}":"${THEME_COLORS.light}";document.head.prepend(m)}catch(e){}})()`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`dark ${archivo.variable} ${geistMono.variable /* taste-skill-ignore */} antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="relative">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-accent focus:px-4 focus:py-2 focus:font-semibold focus:text-accent-ink"
        >
          Skip to content
        </a>
        {children}
        <Stub items={getNavSections()} />
        <Reveal />
        <ChatLauncher />
        <PaletteLauncher items={buildPaletteItems()} />
        <AnalyticsListener />
        <TelemetryBeacon />
        {/* Their scripts are served by Vercel; elsewhere they would only 404. */}
        {process.env.VERCEL && (
          <>
            <Analytics />
            <SpeedInsights />
          </>
        )}
      </body>
    </html>
  );
}
