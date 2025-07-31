import { request } from "@playwright/test";
import { AccountRegistrationDriver } from "../account_registration_driver.interface";
import {
  RegistrationDetails,
  RegistrationResult,
} from "../../dsl/models/registration";
import { CONFIG } from "../../../config/test.config";

export class AccountRegistrationApiDriver implements AccountRegistrationDriver {
  constructor() {}

  async checkServiceHealth(): Promise<void> {
    const context = await request.newContext();
    const response = await context.get(`${CONFIG.apiUrl}/health`);
    if (response.status() !== 200) {
      throw new Error("Registration service is not available");
    }
  }

  async createTestUser(details: RegistrationDetails): Promise<void> {
    const context = await request.newContext();
    const response = await context.post(`${CONFIG.apiUrl}/test-support/users`, {
      data: {
        name: details.name,
        email: details.email,
        password: details.password,
        roleId: details.roleId,
      },
    });

    if (response.status() !== 201 && response.status() !== 200) {
      throw new Error(`Failed to create test user: ${response.statusText()}`);
    }
  }

  async register(details: RegistrationDetails): Promise<RegistrationResult> {
    try {
      const context = await request.newContext();
      const response = await context.post(`${CONFIG.apiUrl}/users/register`, {
        data: {
          name: details.name,
          email: details.email,
          password: details.password,
          roleId: details.roleId,
        },
      });

      return {
        success: response.status() === 201,
        errorMessage:
          response.status() !== 201
            ? (await response.json()).message
            : undefined,
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
    const response = await context.get(
      `${CONFIG.apiUrl}/test-support/confirmations`,
      {
        params: { email },
      }
    );

    if (response.status() === 200) {
      const { confirmationSent } = await response.json();
      return confirmationSent;
    }
    return false;
  }

  async cleanup(): Promise<void> {
    const context = await request.newContext();
    try {
      const response = await context.delete(
        `${CONFIG.apiUrl}/test-support/cleanup`
      );
      if (!response.ok()) {
        console.warn(
          `Cleanup failed with status ${response.status()}: ${await response.text()}`
        );
      }
    } catch (error) {
      console.warn("Failed to cleanup test data:", error);
    }
  }
}
