export interface LoginDto {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface GoogleAuthDto {
  idToken: string;
}
