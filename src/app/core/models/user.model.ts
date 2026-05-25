export interface User {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  onboardingCompleted: boolean;
  preferredLanguage: string;
  roles: string[];
}
