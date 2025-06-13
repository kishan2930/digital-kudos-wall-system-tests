export interface RegistrationDetails {
  name: string;
  email: string;
  password: string;
}

export interface RegistrationResult {
  success: boolean;
  errorMessage?: string;
}
