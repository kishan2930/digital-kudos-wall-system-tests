export interface RegistrationDetails {
  name: string;
  email: string;
  password: string;
  roleId: number;
  isTeamLeader: boolean;
}

export interface RegistrationResult {
  success: boolean;
  errorMessage?: string;
}
