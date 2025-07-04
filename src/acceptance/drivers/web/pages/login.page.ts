import { Page } from "@playwright/test";
import { BasePage } from "../../../../shared/pages/base.page";
import { LoginCredentials } from "../../../dsl/models/login";
import { CONFIG } from "../../../../config/test.config";

export class LoginPage extends BasePage {
  // Selectors using data-testid attributes
  private readonly emailInput = '[data-testid="login-email-input"]';
  private readonly passwordInput = '[data-testid="login-password-input"]';
  private readonly loginButton = '[data-testid="login-submit-button"]';
  private readonly errorMessage = '[data-testid="login-error-message"]';
  private readonly kudosWallContainer = '[data-testid="kudos-wall-container"]';

  constructor(page: Page) {
    super(page);
  }

  async navigate(): Promise<void> {
    await this.page.goto(`${CONFIG.baseUrl}/login`);
    await this.page.waitForSelector(this.emailInput);
  }

  async login(credentials: LoginCredentials): Promise<void> {
    await this.page.fill(this.emailInput, credentials.email);
    await this.page.fill(this.passwordInput, credentials.password);
    await this.page.click(this.loginButton);
  }

  async isLoginSuccessful(): Promise<boolean> {
    return this.isKudosWallVisible();
  }

  async isKudosWallVisible(): Promise<boolean> {
    try {
      await this.page.waitForSelector(this.kudosWallContainer, { timeout: 5000 });
      const url = this.page.url();
      return url.includes("/kudos") && (await this.page.isVisible(this.kudosWallContainer));
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    try {
      await this.page.waitForSelector(this.errorMessage, { timeout: 5000 });
      return (await this.page.textContent(this.errorMessage)) || "";
    } catch {
      return "";
    }
  }
}
