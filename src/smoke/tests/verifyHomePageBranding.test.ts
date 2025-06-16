import { test } from "@playwright/test";
import { PageFactory } from "../../shared/pages/page.factory";

test.describe("Home Page Branding Verification", () => {
  test("should display the correct platform branding and registration heading", async ({ page }) => {
    // Create page object using factory
    const homePage = PageFactory.createHomePage(page);

    // Verify all home page branding elements
    await homePage.verifyHomePageBranding();
  });
});
