import { Page } from "@playwright/test";
import { AccountRegistrationDriver } from "../account_registration_driver.interface";
import { RegistrationDetails, RegistrationResult } from "../../dsl/models/registration";
import { AccountRegistrationPage } from "./pages/account_registration.page";
import { CONFIG } from "../../../config/test.config";
import { PageFactory } from "./pages/page.factory";

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

    // Wait for either success or error state to be determined
    const isSuccessful = await this.accountRegistrationPage.isRegistrationSuccessful();

    if (isSuccessful) {
      return {
        success: true,
        errorMessage: undefined,
      };
    }

    // If not successful, wait for the error message to appear
    const errorMessage = await this.accountRegistrationPage.getErrorMessage();

    return {
      success: false,
      errorMessage: errorMessage || "Registration failed",
    };
  }

  async verifyConfirmationEmail(email: string): Promise<boolean> {
    try {
      const response = await this.page.request.get(`${CONFIG.apiUrl}/test-support/verify-email`, {
        params: { email },
      });

      if (!response.ok()) {
        console.warn(`Failed to verify email via API. Status: ${response.status()}, Body: ${await response.text()}`);
        return false;
      }

      const { sent } = await response.json();
      return sent;
    } catch (error) {
      console.warn("Failed to verify email:", error);
      return false;
    }
  }

  async cleanup(): Promise<void> {
    try {
      const response = await this.page.request.delete(`${CONFIG.apiUrl}/test-support/cleanup`);
      if (!response.ok()) {
        console.warn("Failed to cleanup test data:", await response.text());
      }
    } catch (error) {
      console.warn("Failed to cleanup test data:", error);
    }
  }
}
