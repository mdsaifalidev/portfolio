import { describe, expect, it } from "vitest";
import { countryFrom, isBot } from "@/lib/telemetry";

describe("telemetry helpers", () => {
  it("ignores bots, crawlers and tools", () => {
    expect(isBot(null)).toBe(true);
    for (const ua of ["Googlebot/2.1", "Mozilla/5.0 HeadlessChrome/140", "curl/8.4", "Chrome-Lighthouse", "python-requests/2.31"]) {
      expect(isBot(ua), ua).toBe(true);
    }
    expect(isBot("Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 Chrome/140 Safari/537.36")).toBe(false);
  });

  it("accepts only two-letter country codes", () => {
    expect(countryFrom(new Headers({ "x-vercel-ip-country": "in" }))).toBe("IN");
    expect(countryFrom(new Headers({ "x-vercel-ip-country": "XX" }))).toBeNull();
    expect(countryFrom(new Headers({ "x-vercel-ip-country": "<script>" }))).toBeNull();
    expect(countryFrom(new Headers())).toBeNull();
  });
});
