import { expect, test } from "@playwright/test";

test.describe("home page", () => {
  test("shows the hero and every section in the nav", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: "Md. Saif Ali" })).toBeVisible();
    await expect(page.getByText("Open to remote or relocation")).toBeVisible();

    const nav = page.getByRole("navigation", { name: "Sections" });
    const links = await nav.getByRole("link").all();
    expect(links.length).toBeGreaterThanOrEqual(5);
    for (const link of links) {
      const hash = (await link.getAttribute("href"))!; // e.g. "#about"
      await expect(page.locator(hash)).toBeAttached();
    }
  });

  test("highlights the section being read", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.locator("#experience").evaluate((el) => el.scrollIntoView({ block: "start" }));
    await expect(page.getByRole("navigation", { name: "Sections" }).getByRole("link", { name: "Experience" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  test("remembers the chosen theme across reloads", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    const wasDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));

    await page.getByRole("button", { name: wasDark ? "Switch to light theme" : "Switch to dark theme" }).first().click();
    await page.reload();
    await expect.poll(() => page.evaluate(() => document.documentElement.classList.contains("dark"))).toBe(!wasDark);
  });

  test("has no horizontal scroll on a 375px phone", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 });
    for (const path of ["/", "/projects/insightflow", "/blog"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, path).toBeLessThanOrEqual(0);
    }
  });

  test("shows HashCash platforms and the capability matrix", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Selected work", level: 2 })).toBeVisible();
    await expect(page.getByRole("heading", { name: "MCP Knowledge Server", level: 3 })).toBeVisible();
    // Unreviewed drafts never reach production builds.
    await expect(page.getByRole("heading", { name: "HRMS", level: 3 })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Real-Time Communication Platform", level: 3 })).toHaveCount(0);
    await expect(page.getByRole("heading", { name: "Generative AI & RAG", level: 3 })).toBeVisible();
  });

  test("serves the resume PDF", async ({ request }) => {
    const res = await request.get("/MD.%20SAIF%20ALI_RESUME.pdf");
    expect(res.ok()).toBe(true);
    expect(res.headers()["content-type"]).toContain("application/pdf");

    const fallback = await request.get("/resume.pdf");
    expect(fallback.ok()).toBe(true);
    expect(fallback.headers()["content-type"]).toContain("application/pdf");
  });
});
