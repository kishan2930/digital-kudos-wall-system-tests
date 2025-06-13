import { request } from "@playwright/test";
import { AccountRegistrationDriver } from "../account_registration_driver.interface";
import { RegistrationDetails, RegistrationResult } from "../../dsl/models/registration";

export class AccountRegistrationApiDriver implements AccountRegistrationDriver {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || "http://localhost:3000/api";
  }

  async checkServiceHealth(): Promise<void> {
    const context = await request.newContext();
    const response = await context.get(`${this.baseUrl}/health/registration`);
    if (response.status() !== 200) {
      throw new Error("Registration service is not available");
    }
  }

  async createTestUser(details: RegistrationDetails): Promise<void> {
    const context = await request.newContext();
    const response = await context.post(`${this.baseUrl}/test/users`, {
      data: {
        name: details.name,
        email: details.email,
        password: details.password,
      },
    });

    if (response.status() !== 201 && response.status() !== 200) {
      throw new Error(`Failed to create test user: ${response.statusText()}`);
    }
  }

  async register(details: RegistrationDetails): Promise<RegistrationResult> {
    try {
      const context = await request.newContext();
      const response = await context.post(`${this.baseUrl}/register`, {
        data: details,
      });

      return {
        success: response.status() === 201,
        errorMessage: response.status() !== 201 ? (await response.json()).message : undefined,
      };
    } catch (error) {
      return {
        success: false,
        errorMessage: `Registration failed: ${error}`,
      };
    }
  }

  async verifyConfirmationEmail(email: string): Promise<boolean> {
    const context = await request.newContext();
    const response = await context.get(`${this.baseUrl}/test/confirmations`, {
      params: { email },
    });

    if (response.status() === 200) {
      const { confirmationSent } = await response.json();
      return confirmationSent;
    }
    return false;
  }

  async cleanup(): Promise<void> {
    // Implement any necessary cleanup for API driver
  }
}
