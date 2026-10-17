import { describe, expect, it } from "vitest";
import { GET, HEAD } from "@/app/api/health/route";

describe("health route", () => {
  it("handles HEAD requests with 200 OK and no body", async () => {
    const res = HEAD();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(res.headers.get("cache-control")).toBe("no-store, no-cache, must-revalidate");
    expect(res.body).toBeNull();
  });

  it("handles GET requests with 200 OK and 'ok' text", async () => {
    const res = GET();
    expect(res.status).toBe(200);
    expect(res.headers.get("content-type")).toBe("text/plain; charset=utf-8");
    expect(res.headers.get("cache-control")).toBe("no-store, no-cache, must-revalidate");
    expect(await res.text()).toBe("ok");
  });
});
