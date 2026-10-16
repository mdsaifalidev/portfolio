import fs from "node:fs";
import path from "node:path";
import Image from "next/image";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

// Drop a square photo at public/me.jpg and it replaces the monogram on the next build.
const PORTRAIT = "/me.jpg";
const hasPortrait = fs.existsSync(path.join(process.cwd(), "public", PORTRAIT));

export function Avatar({ size = 56, className }: { size?: number; className?: string }) {
  if (hasPortrait) {
    return (
      <Image
        src={PORTRAIT}
        alt={`Portrait of ${profile.name}`}
        width={size * 2}
        height={size * 2}
        style={{ width: size, height: size }}
        className={cn("object-cover", className)}
      />
    );
  }
  return (
    <div
      aria-hidden="true"
      style={{ width: size, height: size }}
      className={cn("condensed flex items-center justify-center bg-[var(--page-ink)] text-step-1 text-[var(--sheet)]", className)}
    >
      {profile.initials}
    </div>
  );
}
