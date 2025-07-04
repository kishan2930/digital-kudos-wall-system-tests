import { Page } from "@playwright/test";
import { LoginDriver } from "../login_driver.interface";
import { LoginCredentials } from "../../dsl/models/login";
import { LoginPage } from "../web/pages/login.page";
import { PageFactory } from "../web/pages/page.factory";
import { CONFIG } from "../../../config/test.config";

export class LoginWebDriver implements LoginDriver {
  private readonly loginPage: LoginPage;

  constructor(private readonly page: Page) {
    this.loginPage = PageFactory.createLoginPage(page);
  }

  async checkServiceHealth(): Promise<void> {
    await this.loginPage.navigate();
  }

  async createTestUser(credentials: LoginCredentials): Promise<void> {
    const response = await this.page.request.post(`${CONFIG.apiUrl}/test-support/users`, {
      data: {
        name: "Test User",
        email: credentials.email,
        password: credentials.password,
      },
    });

    if (!response.ok()) {
      throw new Error(
        `Failed to create test user via API. Status: ${response.status()}, Body: ${await response.text()}`
      );
    }
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.loginPage.navigate();
    await this.loginPage.login(credentials);
  }

  async isLoginSuccessful(): Promise<boolean> {
    return this.loginPage.isLoginSuccessful();
  }

  async isKudosWallVisible(): Promise<boolean> {
    return this.loginPage.isKudosWallVisible();
  }

  async getLoginErrorMessage(): Promise<string> {
    return this.loginPage.getErrorMessage();
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
