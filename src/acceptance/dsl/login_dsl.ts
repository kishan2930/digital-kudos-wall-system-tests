import { LoginDriver } from "../drivers/login_driver.interface";
import { LoginCredentials } from "./models/login";

export class LoginDSL {
  constructor(private readonly loginDriver: LoginDriver) {}

  async checkServiceAvailability(): Promise<void> {
    await this.loginDriver.checkServiceHealth();
  }

  async createTestUser(email: string, password: string): Promise<void> {
    await this.loginDriver.createTestUser({ email, password });
  }

  async loginUser(credentials: LoginCredentials): Promise<void> {
    await this.loginDriver.login(credentials);
  }

  async isLoginSuccessful(): Promise<boolean> {
    return this.loginDriver.isLoginSuccessful();
  }

  async isKudosWallVisible(): Promise<boolean> {
    return this.loginDriver.isKudosWallVisible();
  }

  async getLoginErrorMessage(): Promise<string> {
    return this.loginDriver.getLoginErrorMessage();
  }

  async cleanup(): Promise<void> {
    await this.loginDriver.cleanup();
  }
}
