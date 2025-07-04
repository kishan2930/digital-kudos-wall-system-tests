export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  errorMessage?: string;
}

export interface PasswordResetResult {
  success: boolean;
  errorMessage?: string;
}
