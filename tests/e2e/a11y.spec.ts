import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";

const WCAG = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"];
const PAGES = ["/", "/projects/insightflow", "/projects/portfolio-ai-assistant", "/blog", "/privacy", "/definitely-not-a-page"];

async function audit(page: Page) {
  const { violations } = await new AxeBuilder({ page }).withTags(WCAG).analyze();
  // Readable failure output: rule, impact and the first offending selectors.
  return violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(" ")).join(" | ")}`);
}

for (const theme of ["dark", "light"] as const) {
  test.describe(`accessibility - ${theme} theme`, () => {
    test.beforeEach(async ({ page }) => {
      await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
    });

    for (const path of PAGES) {
      test(`${path} has no WCAG A/AA violations`, async ({ page }) => {
        await page.goto(path);
        await page.waitForLoadState("networkidle");
        expect(await audit(page)).toEqual([]);
      });
    }

    test("assistant panel has no violations", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "Ask", exact: true }).click();
      await expect(page.getByRole("dialog", { name: "Ask about Saif" })).toBeVisible();
      expect(await audit(page)).toEqual([]);
    });

    test("command palette has no violations", async ({ page }) => {
      await page.goto("/");
      await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "Open command menu" }).click();
      await expect(page.getByRole("dialog", { name: "Command menu" })).toBeVisible();
      expect(await audit(page)).toEqual([]);
    });
  });
}
