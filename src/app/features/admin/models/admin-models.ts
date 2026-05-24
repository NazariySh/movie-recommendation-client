export interface AdminUserListItem {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  roles: string[];
  isActive: boolean;
  isLocked: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  lockoutEnd: string | null;
}

export interface AdminUserActivity {
  totalRatings: number;
  totalReviews: number;
  totalReplies: number;
  watchlistCount: number;
  lastActivityAt: string | null;
}

export interface AdminUserDetail {
  id: string;
  username: string;
  email: string;
  avatarUrl: string | null;
  bio: string | null;
  preferredLanguage: string;
  roles: string[];
  isActive: boolean;
  isLocked: boolean;
  emailConfirmed: boolean;
  createdAt: string;
  lockoutEnd: string | null;
  activity: AdminUserActivity;
}

export interface SearchAdminUsersQuery {
  search?: string;
  role?: string;
  isLocked?: boolean;
  isActive?: boolean;
  sort?: 'createdAt' | 'username' | 'email';
  order?: 'asc' | 'desc';
  pageNumber: number;
  pageSize: number;
}

export interface DashboardSummary {
  totalUsers: number;
  dau: number;
  mau: number;
  totalMovies: number;
  totalSeries: number;
  totalRatings: number;
  ratingsToday: number;
  ratingsLast7Days: number;
  ratingsLast30Days: number;
  totalReviews: number;
  topGenres: { slug: string; count: number }[];
  model: { lastTrainedAt: string | null; samplesCount: number | null; rmse: number | null } | null;
}

export interface DashboardActivity {
  from: string;
  to: string;
  points: { date: string; newUsers: number; ratings: number; reviews: number }[];
}

export interface MlModelStatus {
  hasModel: boolean;
  version?: string | null;
  trainedAt?: string | null;
  rmse?: number | null;
  r2?: number | null;
  sampleCount?: number | null;
  isActive?: boolean | null;
}

export interface AdminMovieFormDto {
  key?: string;
  type: 'Movie' | 'Series';
  status: string;
  originalTitle: string;
  originalLang: string;
  posterUrl?: string | null;
  backdropUrl?: string | null;
  trailerYoutubeId?: string | null;
  releaseDate?: string | null;
  runtime?: number | null;
  budget?: number | null;
  revenue?: number | null;
  imdbId?: string | null;
  tmdbId?: number | null;
  seasonsCount?: number | null;
  episodesCount?: number | null;
  isOngoing?: boolean | null;
  genreIds: number[];
  translations: { languageCode: string; title: string; overview?: string | null; tagline?: string | null }[];
}

export interface AdminArtistFormDto {
  name: string;
  imdbId?: string | null;
  tmdbId?: number | null;
  photoUrl?: string | null;
  birthday?: string | null;
  dateOfDeath?: string | null;
  placeOfBirth?: string | null;
  nationality?: string | null;
  gender?: string | null;
  knownForDepartment?: string | null;
  biography?: string | null;
}
