import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Privacy-friendly visit counters (see /privacy):
// - total visits: a plain counter
// - unique visitors: a HyperLogLog of salted IP hashes - the HLL can't be read back into visitors
// - countries: per-country counts from Vercel's geo header; nothing finer than country level
// No cookies, no raw IPs, no per-visitor records.

// Overridable so tests can use a throwaway namespace.
const PREFIX = process.env.TELEMETRY_PREFIX || "portfolio:telemetry";
const KEYS = { visits: `${PREFIX}:visits`, uniques: `${PREFIX}:uniques`, countries: `${PREFIX}:countries` };

const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null;

const limiter = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(20, "1 h"), prefix: `${PREFIX}:rl` })
  : null;

const BOT = /bot|crawl|spider|slurp|preview|lighthouse|headless|monitor|curl|wget|python|axios|node-fetch/i;

export function isBot(userAgent: string | null) {
  return !userAgent || BOT.test(userAgent);
}

/** ISO 3166-1 alpha-2 from Vercel's geo header, or null for anything unexpected. */
export function countryFrom(headers: Headers) {
  const code = headers.get("x-vercel-ip-country")?.trim().toUpperCase();
  return code && /^[A-Z]{2}$/.test(code) && code !== "XX" ? code : null;
}

function visitorHash(headers: Headers) {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "unknown";
  return createHash("sha256")
    .update(`${process.env.TELEMETRY_SALT ?? ""}:${ip}`)
    .digest("hex")
    .slice(0, 32);
}

/** Counts a visit. Only on the Vercel deployment, so local runs and tests never touch real numbers. */
export async function recordVisit(headers: Headers) {
  if (!redis || !process.env.VERCEL || isBot(headers.get("user-agent"))) return false;
  const visitor = visitorHash(headers);
  if (limiter && !(await limiter.limit(visitor)).success) return false;

  const country = countryFrom(headers);
  const tx = redis.multi();
  tx.incr(KEYS.visits);
  tx.pfadd(KEYS.uniques, visitor);
  if (country) tx.hincrby(KEYS.countries, country, 1);
  await tx.exec();
  return true;
}

export type TelemetryStats = { visits: number; uniques: number; countries: Record<string, number> };

export async function getStats(): Promise<TelemetryStats | null> {
  if (!redis) return null;
  const [visits, uniques, countries] = await Promise.all([
    redis.get<number>(KEYS.visits),
    redis.pfcount(KEYS.uniques),
    redis.hgetall<Record<string, number>>(KEYS.countries),
  ]);
  return { visits: Number(visits ?? 0), uniques: Number(uniques ?? 0), countries: countries ?? {} };
}
