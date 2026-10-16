import { createHash } from "node:crypto";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Per visitor: a burst limit and a daily cap. Site-wide: a daily budget so total usage can't exceed
// the Gemini quota (or bill). Disabled when Upstash isn't configured, e.g. a fresh local clone.
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN ? Redis.fromEnv() : null;

const visitorLimiters = redis
  ? [
      new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "portfolio:chat:min" }),
      new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(40, "1 d"), prefix: "portfolio:chat:day" }),
    ]
  : [];

const budget = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(Number(process.env.CHAT_DAILY_BUDGET) || 300, "1 d"),
      prefix: "portfolio:chat:budget",
    })
  : null;

/** Hash the IP so raw addresses are never stored in Redis. */
export function visitorId(headers: Headers) {
  const ip = headers.get("x-forwarded-for")?.split(",")[0]?.trim() || headers.get("x-real-ip") || "local";
  return createHash("sha256").update(ip).digest("hex").slice(0, 32);
}

// Contact form: a few messages per visitor, to stop floods without blocking real follow-ups.
const contactLimiters = redis
  ? [
      new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(3, "10 m"), prefix: "portfolio:contact:10m" }),
      new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 d"), prefix: "portfolio:contact:day" }),
    ]
  : [];

export async function checkContactLimit(id: string) {
  for (const limiter of contactLimiters) {
    if (!(await limiter.limit(id)).success) return false;
  }
  return true;
}

export type LimitResult = "ok" | "visitor" | "budget";

export async function checkRateLimit(id: string): Promise<LimitResult> {
  for (const limiter of visitorLimiters) {
    if (!(await limiter.limit(id)).success) return "visitor";
  }
  if (budget && !(await budget.limit("site")).success) return "budget";
  return "ok";
}
