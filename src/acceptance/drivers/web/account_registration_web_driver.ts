import { Page } from "@playwright/test";
import { AccountRegistrationDriver } from "../account_registration_driver.interface";
import { RegistrationDetails, RegistrationResult } from "../../dsl/models/registration";
import { PageFactory } from "./pages/page.factory";
import { AccountRegistrationPage } from "./pages/account_registration.page";
import { CONFIG } from "../../../config/test.config";

export class AccountRegistrationWebDriver implements AccountRegistrationDriver {
  private readonly accountRegistrationPage: AccountRegistrationPage;

  constructor(private readonly page: Page) {
    this.accountRegistrationPage = PageFactory.createAccountRegistrationPage(page);
  }

  async checkServiceHealth(): Promise<void> {
    await this.accountRegistrationPage.navigate();
  }

  async createTestUser(details: RegistrationDetails): Promise<void> {
    const response = await this.page.request.post(`${CONFIG.apiUrl}/test-support/users`, {
      data: {
        name: details.name,
        email: details.email,
        password: details.password,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to create test user via API. Status: ${response.status()}, Body: ${await response.text()}`
      );
    }
  }

  async register(details: RegistrationDetails): Promise<RegistrationResult> {
    await this.accountRegistrationPage.navigate();
    await this.accountRegistrationPage.registerUser(details);

    const errorMessage = await this.accountRegistrationPage.getErrorMessage();
    if (errorMessage) {
      return {
        success: false,
        errorMessage,
      };
    }

    const isSuccessful = await this.accountRegistrationPage.isRegistrationSuccessful();
    return {
      success: isSuccessful,
      errorMessage: isSuccessful ? undefined : "Registration failed",
    };
  }

  async verifyConfirmationEmail(email: string): Promise<boolean> {
    return this.accountRegistrationPage.isConfirmationEmailSentTo(email);
  }

  async cleanup(): Promise<void> {
    try {
      const response = await this.page.request.delete(`${CONFIG.apiUrl}/test-support/cleanup`);

      if (!response.ok()) {
        console.warn(`Cleanup failed with status ${response.status()}: ${await response.text()}`);
      }
    } catch (error) {
      console.warn("Failed to cleanup test data:", error);
    }
  }
}
