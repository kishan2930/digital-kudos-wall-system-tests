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
    const errorElement = this.page.getByTestId("error-message");
    if (await errorElement.isVisible()) {
      return (await errorElement.textContent()) || null;
    }
    return null;
  }

  async isRegistrationSuccessful(): Promise<boolean> {
    try {
      await this.page.waitForURL("**/login", { timeout: 5000 });
      return true;
    } catch (error) {
      return false;
    }
  }

  async isConfirmationEmailSentTo(email: string): Promise<boolean> {
    try {
      await this.page.waitForURL("**/login", { timeout: 5000 });

      const locator = this.page.getByTestId("confirmation-message");
      await locator.waitFor({ state: "visible", timeout: 10000 });
      const textContent = await locator.textContent();
      return textContent?.includes(email) ?? false;
    } catch {
      return false;
    }
  }

  protected async waitForPageLoad(): Promise<void> {
    await this.page.waitForSelector('[data-testid="registration-form"]');
  }
}
