import { Page, expect } from "@playwright/test";
import { BasePage } from "./base.page";

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.navigateTo("/");
  }

  async verifyPlatformBranding(): Promise<void> {
    const appBarTitle = this.page.locator('[data-testid="app-bar-title"], .MuiAppBar-root .MuiTypography-h6');
    await expect(appBarTitle).toContainText("Digital Kudos Wall Platform");
  }

  async verifyRegistrationHeading(): Promise<void> {
    const mainHeading = this.page.locator("h1");
    await expect(mainHeading).toContainText("Join Our Team");
  }

  async verifyRegistrationFormIsVisible(): Promise<void> {
    const registrationForm = this.page.locator('[data-testid="registration-form"], form');
    await expect(registrationForm).toBeVisible();
  }

  async verifyHomePageBranding(): Promise<void> {
    await this.navigate();
    await this.verifyPlatformBranding();
    await this.verifyRegistrationHeading();
    await this.verifyRegistrationFormIsVisible();
  }

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForSelector('[data-testid="registration-form"], form');
  }
}
