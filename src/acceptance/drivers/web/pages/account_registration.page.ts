import { Page } from "@playwright/test";
import { BasePage } from "../../../../shared/pages/base.page";
import { RegistrationDetails } from "../../../dsl/models/registration";
import { CONFIG } from "../../../../config/test.config";

export class AccountRegistrationPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto(`${CONFIG.baseUrl}/`);
    await this.waitForPageLoad();
  }

  async registerUser(details: RegistrationDetails): Promise<void> {
    await this.page.getByTestId("name-input").fill(details.name);
    await this.page.getByTestId("email-input").fill(details.email);
    await this.page.getByTestId("password-input").fill(details.password);
    await this.page.getByTestId("register-button").click();
  }

  async getErrorMessage(): Promise<string | null> {
    try {
      const errorElement = this.page.getByTestId("error-message");
      // Wait for the error message to appear with a reasonable timeout
      await errorElement.waitFor({ state: "visible", timeout: 10000 });
      return (await errorElement.textContent()) || null;
    } catch (error) {
      // If error message element doesn't appear within timeout, return null
      return null;
    }
  }

  async isRegistrationSuccessful(): Promise<boolean> {
    try {
      await this.page.waitForURL("**/login", { timeout: 10000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForSelector('[data-testid="registration-form"]');
  }
}
