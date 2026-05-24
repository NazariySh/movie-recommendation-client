export interface UserProfile {
  id: string;
  username: string;
  email: string;
  emailConfirmed: boolean;
  avatarUrl: string | null;
  bio: string | null;
  preferredLanguage: string;
  onboardingCompleted: boolean;
  createdAt: string;
  roles: string[];
}

export interface UpdateProfilePayload {
  username: string;
  bio: string | null;
  preferredLanguage: string;
}

export interface PublicProfile {
  id: string;
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  createdAt: string;
  totalRatings: number;
  totalReviews: number;
  completedCount: number;
  averageRatingGiven: number | null;
}

export interface WatchlistCounts {
  planToWatch: number;
  watching: number;
  completed: number;
  dropped: number;
}

export interface TopGenre {
  slug: string;
  name: string;
  count: number;
}

export interface UserStats {
  totalRatings: number;
  totalReviews: number;
  totalCommentsReceived: number;
  watchlistCounts: WatchlistCounts;
  averageRatingGiven: number | null;
  ratingDistribution: number[];
  topGenres: TopGenre[];
  totalRuntimeMinutesWatched: number;
  memberSinceDays: number;
  ratingsThisMonth: number;
  longestStreak: number;
}

export interface GenrePreference {
  genreId: number;
  slug: string;
  name: string;
  weight: number;
}

export interface UpdateGenrePreferencePayload {
  genreId: number;
  weight: number;
}
