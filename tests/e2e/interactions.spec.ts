import fs from "node:fs";
import path from "node:path";
import { expect, test } from "@playwright/test";

// A real /api/chat response captured from the app; tests never call Gemini.
const chatStream = fs.readFileSync(path.join(__dirname, "fixtures", "chat-stream.txt"), "utf8");

test.describe("command palette", () => {
  test("opens with Ctrl+K, filters and navigates", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.keyboard.press("Control+K");

    const palette = page.getByRole("dialog", { name: "Command menu" });
    await expect(palette).toBeVisible();
    await palette.getByRole("combobox").fill("insight");
    await expect(palette.getByRole("option", { name: /InsightFlow/ })).toBeVisible();
    await page.keyboard.press("ArrowDown"); // first option is "Ask my AI: ..."
    await page.keyboard.press("Enter");
    await expect(page).toHaveURL(/\/projects\/insightflow$/);
  });

  test("closes with Escape", async ({ page }) => {
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Open command menu" }).click();
    const palette = page.getByRole("dialog", { name: "Command menu" });
    await expect(palette).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(palette).toBeHidden();
  });
});

test.describe("AI assistant", () => {
  test("streams an answer with citations and source links", async ({ page }) => {
    await page.route("**/api/chat", (route) =>
      route.fulfill({
        status: 200,
        headers: { "content-type": "text/event-stream", "x-vercel-ai-ui-message-stream": "v1" },
        body: chatStream,
      }),
    );
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Ask my AI", exact: true }).first().click();

    const chat = page.getByRole("dialog", { name: "Ask about Saif" });
    await expect(chat).toBeVisible();
    await expect(chat.getByRole("textbox", { name: "Your question" })).toBeFocused();
    await chat.getByRole("button", { name: "Is Saif open to remote roles?" }).click();

    await expect(chat.getByText(/open to remote roles/i).last()).toBeVisible();
    await expect(chat.getByRole("link", { name: /^Source 2:/ }).first()).toHaveAttribute("href", "/#about");
    // Source chips carry the title as text; the inline citation badges only show the number.
    await expect(chat.locator("a", { hasText: "Profile & availability" })).toHaveAttribute("href", "/#about");

    await page.keyboard.press("Escape");
    await expect(chat).toBeHidden();
    await expect(page.getByRole("button", { name: "Ask", exact: true })).toBeVisible();
  });

  test("shows the server's message when rate limited", async ({ page }) => {
    await page.route("**/api/chat", (route) =>
      route.fulfill({ status: 429, contentType: "text/plain", body: "You've asked a lot of questions in a short time." }),
    );
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "Ask", exact: true }).click();
    const chat = page.getByRole("dialog", { name: "Ask about Saif" });
    await chat.getByRole("textbox", { name: "Your question" }).fill("Hello?");
    await page.keyboard.press("Enter");
    await expect(chat.getByText("You've asked a lot of questions in a short time.")).toBeVisible();
  });
});

test.describe("contact form", () => {
  test("shows field errors without sending anything", async ({ page }) => {
    await page.goto("/#contact");
    await page.waitForLoadState("networkidle");
    const email = page.getByRole("textbox", { name: "Email" });
    await email.fill("not-an-email");
    await page.getByRole("textbox", { name: "Message" }).fill("hi");
    await page.getByRole("button", { name: "Send message" }).click();

    await expect(page.getByText("Please enter your name.")).toBeVisible();
    await expect(page.getByText("Please enter a valid email address.")).toBeVisible();
    await expect(page.getByText(/at least a sentence/)).toBeVisible();
    await expect(email).toHaveAttribute("aria-invalid", "true");
    await expect(email).toHaveValue("not-an-email");
  });
});
