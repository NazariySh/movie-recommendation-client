export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  preferredLanguage: string;
}

export interface ResendVerificationDto {
  email: string;
}
