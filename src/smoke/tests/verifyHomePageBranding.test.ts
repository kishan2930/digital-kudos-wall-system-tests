import { test, expect } from "@playwright/test";

test.describe("Home Page Branding Verification", () => {
  test("should display the correct main heading", async ({ page }) => {
    // Navigate to the home page (assuming it's the root URL)
    // The base URL will be configured in playwright.config.ts or passed as an environment variable
    await page.goto("/");

    // Check for the updated heading text
    const heading = page.locator("h1");
    await expect(heading).toContainText("Digital Kudos Wall Platform");
  });
});
