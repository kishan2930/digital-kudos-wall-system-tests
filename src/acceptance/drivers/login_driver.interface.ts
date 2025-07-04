import { LoginCredentials } from "../dsl/models/login";

export interface LoginDriver {
  checkServiceHealth(): Promise<void>;
  createTestUser(credentials: LoginCredentials): Promise<void>;
  login(credentials: LoginCredentials): Promise<void>;
  isLoginSuccessful(): Promise<boolean>;
  isKudosWallVisible(): Promise<boolean>;
  getLoginErrorMessage(): Promise<string>;
  cleanup(): Promise<void>;
}
