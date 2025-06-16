import { PageFactory } from "@/shared/pages/page.factory";
import { test } from "@playwright/test";

test.describe("Home Page Branding Verification", () => {
  test("should display the correct platform branding and registration heading", async ({ page }) => {
    const homePage = PageFactory.createHomePage(page);

    // Verify all home page branding elements
    await homePage.verifyHomePageBranding();
  });
});
