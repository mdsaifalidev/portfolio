import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { profile } from "@/content/profile";
import { clip } from "@/lib/text";

// Shared 1200x630 social card in the site's look. Used by every opengraph-image.tsx.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const font = (file: string) => readFile(join(process.cwd(), "assets", "fonts", file));

const plain = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1");

export async function ogImage({
  label,
  title,
  subtitle,
  chips = [],
}: {
  label: string;
  title: string;
  subtitle?: string;
  chips?: string[];
}) {
  const [regular, semibold, mono] = await Promise.all([
    font("Geist-Regular.ttf"),
    font("Geist-SemiBold.ttf"),
    font("GeistMono-Medium.ttf"),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#0c0b09",
          backgroundImage: "radial-gradient(circle at 85% 0%, rgba(255,176,0,0.14), transparent 55%)",
          fontFamily: "Geist",
          color: "#f3eee4",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 64,
              height: 64,
              borderRadius: 16,
              border: "2px solid #2b2720",
              backgroundColor: "#16140f",
              fontFamily: "Geist Mono",
              fontSize: 26,
              color: "#ffb000",
            }}
          >
            SA
          </div>
          <div style={{ display: "flex", fontFamily: "Geist Mono", fontSize: 22, letterSpacing: 3, color: "#a39a8a" }}>
            {label.toUpperCase()}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ display: "flex", fontSize: title.length > 50 ? 60 : 72, fontWeight: 600, lineHeight: 1.1, letterSpacing: -2 }}>
            {clip(title, 90)}
          </div>
          {subtitle && (
            <div style={{ display: "flex", fontSize: 30, lineHeight: 1.4, color: "#a39a8a", maxWidth: 1000 }}>
              {clip(plain(subtitle), 175)}
            </div>
          )}
          {chips.length > 0 && (
            <div style={{ display: "flex", gap: 12 }}>
              {chips.slice(0, 4).map((chip) => (
                <div
                  key={chip}
                  style={{
                    display: "flex",
                    padding: "6px 16px",
                    borderRadius: 999,
                    backgroundColor: "rgba(255,176,0,0.12)",
                    color: "#ffb000",
                    fontFamily: "Geist Mono",
                    fontSize: 20,
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
          <div style={{ display: "flex", gap: 12 }}>
            <span style={{ fontWeight: 600 }}>{profile.name}</span>
            <span style={{ color: "#a39a8a" }}> |  {profile.role}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, fontFamily: "Geist Mono", fontSize: 18, color: "#ffb000" }}>
            <div style={{ display: "flex", width: 10, height: 10, borderRadius: 999, backgroundColor: "#ffb000" }} />
            Open to work
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
        { name: "Geist Mono", data: mono, weight: 500, style: "normal" },
      ],
    },
  );
}
