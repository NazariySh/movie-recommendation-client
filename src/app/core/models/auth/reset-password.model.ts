export interface ResetPasswordDto {
  userId: string;
  token: string;
  newPassword: string;
}
