import { AccountRegistrationDriver } from "../drivers/account_registration_driver.interface";
import { RegistrationDetails, RegistrationResult } from "./models/registration";

export class AccountRegistrationDSL {
  private registrationResult: RegistrationResult | null = null;

  constructor(private readonly driver: AccountRegistrationDriver) {}

  /**
   * Verifies that the registration service is available and ready
   */
  async verifyRegistrationServiceAvailable(): Promise<void> {
    try {
      await this.driver.checkServiceHealth();
    } catch (error) {
      throw new Error(`Failed to verify registration service: ${error}`);
    }
  }

  /**
   * Ensures a test user exists in the system
   * @param details Details of the user to ensure exists
   */
  async ensureUserExists(details: RegistrationDetails): Promise<void> {
    try {
      await this.driver.createTestUser(details);
    } catch (error) {
      throw new Error(`Failed to ensure user exists: ${error}`);
    }
  }

  /**
   * Registers a new user with the provided details
   * @param details Registration details including email and password
   */
  async registerUser(details: RegistrationDetails): Promise<void> {
    try {
      const result = await this.driver.register(details);
      this.registrationResult = result;
    } catch (error) {
      this.registrationResult = {
        success: false,
        errorMessage: `Registration failed: ${error}`,
      };
    }
  }

  /**
   * Gets the result of the last registration attempt
   */
  async getRegistrationResult(): Promise<RegistrationResult> {
    if (!this.registrationResult) {
      throw new Error("No registration attempt has been made");
    }
    return this.registrationResult;
  }

  /**
   * Verifies if a confirmation was sent to the specified email
   * @param email Email address to check for confirmation
   */
  async verifyConfirmationSent(email: string): Promise<boolean> {
    try {
      return await this.driver.verifyConfirmationEmail(email);
    } catch (error) {
      throw new Error(`Failed to verify confirmation: ${error}`);
    }
  }

  /**
   * Cleans up any test data created during the test
   */
  async cleanup(): Promise<void> {
    await this.driver.cleanup();
    this.registrationResult = null;
  }
}
