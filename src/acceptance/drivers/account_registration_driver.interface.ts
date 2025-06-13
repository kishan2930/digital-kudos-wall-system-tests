import { RegistrationDetails, RegistrationResult } from "../dsl/models/registration";

export interface AccountRegistrationDriver {
  /**
   * Check if the registration service is healthy and available
   */
  checkServiceHealth(): Promise<void>;

  /**
   * Create a test user for verification purposes
   * @param details Registration details
   */
  createTestUser(details: RegistrationDetails): Promise<void>;

  /**
   * Register a new user
   * @param details Registration details
   */
  register(details: RegistrationDetails): Promise<RegistrationResult>;

  /**
   * Verify if a confirmation email was sent
   * @param email Email to check for confirmation
   */
  verifyConfirmationEmail(email: string): Promise<boolean>;

  /**
   * Clean up any test data
   */
  cleanup(): Promise<void>;
}
