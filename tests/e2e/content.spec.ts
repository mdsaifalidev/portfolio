import { expect, test } from "@playwright/test";

test.describe("content routes", () => {
  test("case study table of contents points at real headings", async ({ page }) => {
    await page.goto("/projects/insightflow");
    await expect(page.getByRole("heading", { level: 1, name: "InsightFlow" })).toBeVisible();
    const toc = page.getByRole("navigation", { name: "On this page" });
    const hrefs = await toc.getByRole("link").evaluateAll((links) => links.map((a) => a.getAttribute("href")!));
    expect(hrefs.length).toBeGreaterThan(3);
    for (const href of hrefs) await expect(page.locator(href)).toBeAttached();
  });

  test("blog index renders", async ({ page }) => {
    const res = await page.goto("/blog");
    expect(res?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1, name: "Writing" })).toBeVisible();
  });

  test("drafts are not published", async ({ request }) => {
    for (const draft of ["hrms", "realtime-communication", "mcp-knowledge-server", "multi-tenant-rag"]) {
      expect((await request.get(`/projects/${draft}`)).status(), draft).toBe(404);
    }
    const sitemap = await (await request.get("/sitemap.xml")).text();
    expect(sitemap).toContain("/projects/insightflow");
    expect(sitemap).not.toMatch(/hrms|realtime-communication|mcp-knowledge-server|multi-tenant-rag/);
  });

  test("feeds and crawler files are valid", async ({ request }) => {
    const rss = await request.get("/blog/rss.xml");
    expect(rss.headers()["content-type"]).toContain("application/rss+xml");
    expect(await rss.text()).toContain("<rss");

    const robots = await (await request.get("/robots.txt")).text();
    expect(robots).toMatch(/Sitemap: https?:\/\/.+\/sitemap\.xml/);
    expect(robots).toContain("Disallow: /api/");
  });

  test("social images are PNGs and linked from the page", async ({ page, request }) => {
    const og = await request.get("/opengraph-image");
    expect(og.headers()["content-type"]).toBe("image/png");

    await page.goto("/projects/insightflow");
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute("content", /\/projects\/insightflow\/opengraph-image/);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute("content", "summary_large_image");
  });

  test("home has Person structured data", async ({ page }) => {
    await page.goto("/");
    const json = await page.locator('script[type="application/ld+json"]').first().textContent();
    const data = JSON.parse(json!);
    const person = data["@graph"].find((n: { "@type": string }) => n["@type"] === "Person");
    expect(person.name).toBe("Md. Saif Ali");
    expect(person.sameAs).toEqual(expect.arrayContaining([expect.stringContaining("linkedin.com")]));
  });

  test("unknown pages get the custom 404", async ({ page }) => {
    const res = await page.goto("/definitely-not-a-page");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: "This page doesn't exist." })).toBeVisible();
  });

  test("privacy page explains what is collected", async ({ page }) => {
    await page.goto("/privacy");
    await expect(page.getByRole("heading", { level: 1, name: "Privacy" })).toBeVisible();
    await expect(page.getByText(/IP addresses are never stored/)).toBeVisible();
  });

  test("telemetry lights up visitor countries", async ({ page }) => {
    await page.route("**/api/telemetry", (route) =>
      route.request().method() === "GET"
        ? route.fulfill({ json: { visits: 42, uniques: 30, countries: { IN: 25, US: 10, DE: 7 } } })
        : route.fulfill({ status: 204 }),
    );
    await page.goto("/");
    await page.locator("#telemetry").scrollIntoViewIfNeeded();
    const panel = page.locator("#telemetry");
    await expect(panel.getByText("42", { exact: true })).toBeVisible();
    await expect(panel.getByText("India")).toBeVisible();
    await expect(panel.getByRole("img", { name: /visitors from 3 countries/ })).toBeVisible();
    expect(await panel.locator("circle.fill-accent").count()).toBeGreaterThan(10);
  });
});

