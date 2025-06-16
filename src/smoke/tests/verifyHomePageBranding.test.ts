import { test, expect } from "@playwright/test";

test.describe("Home Page Branding Verification", () => {
  test("should display the correct platform branding and registration heading", async ({ page }) => {
    // Navigate to the home page (registration page)
    await page.goto("/");

    // Check for the platform branding in the app bar
    const appBarTitle = page.locator('[data-testid="app-bar-title"], .MuiAppBar-root .MuiTypography-h6');
    await expect(appBarTitle).toContainText("Digital Kudos Wall Platform");

    // Check for the registration page main heading
    const mainHeading = page.locator("h1");
    await expect(mainHeading).toContainText("Join Our Team");

    // Verify the registration form is present
    const registrationForm = page.locator('[data-testid="registration-form"], form');
    await expect(registrationForm).toBeVisible();
  });
});
