import { Page } from "@playwright/test";
import { AccountRegistrationDriver } from "../account_registration_driver.interface";
import { RegistrationDetails, RegistrationResult } from "../../dsl/models/registration";
import { PageFactory } from "../../../shared/pages/page.factory";
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
    console.log(`[DEBUG] Starting registration for email: ${details.email}`);
    await this.accountRegistrationPage.navigate();
    console.log("[DEBUG] Navigation complete");

    await this.accountRegistrationPage.registerUser(details);
    console.log("[DEBUG] Registration form submitted");

    const errorMessage = await this.accountRegistrationPage.getErrorMessage();
    console.log(`[DEBUG] Initial error message check: ${errorMessage}`);

    if (errorMessage) {
      console.log(`[DEBUG] Returning early with error: ${errorMessage}`);
      return {
        success: false,
        errorMessage,
      };
    }

    const isSuccessful = await this.accountRegistrationPage.isRegistrationSuccessful();
    console.log(`[DEBUG] Registration success check: ${isSuccessful}`);

    if (!isSuccessful) {
      const failureMessage = await this.accountRegistrationPage.getErrorMessage();
      console.log(`[DEBUG] Registration failed. Error message: ${failureMessage}`);
      return {
        success: false,
        errorMessage: failureMessage || "Registration failed",
      };
    }

    console.log("[DEBUG] Registration completed successfully");
    return {
      success: true,
      errorMessage: undefined,
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
