import { test, expect } from "@playwright/test";

test.describe("Acceptance: Home Page Branding", () => {
  test("should display the correct main heading on the home page", async ({ page }) => {
    // Navigate to the home page
    await page.goto("/");

    // Verify the main heading
    const heading = page.locator("h1");
    await expect(heading).toContainText("Digital Kudos Wall Platform");
  });
});
