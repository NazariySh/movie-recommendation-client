export const AppRoutes = {
  DISCOVER: '',
  MOVIES: 'movies',
  MOVIE_DETAIL: 'movies',
  ARTISTS: 'artists',
  AUTH: 'auth',
  SEARCH: 'search',
  PROFILE: 'profile',
  USERS: 'users',
  ADMIN: 'admin',
  ONBOARDING: 'onboarding',
  RULES: 'rules',
  NOT_FOUND: 'not-found',
  ERROR: 'error',
} as const;

export const AuthRoutes = {
  LOGIN: 'login',
  REGISTER: 'register',
  VERIFY_EMAIL: 'verify-email',
  FORGOT_PASSWORD: 'forgot-password',
  RESET_PASSWORD: 'reset-password',
} as const;

export const MoviesRoutes = {
  FILTERS: 'filters',
} as const;

export const AdminRoutes = {
  DASHBOARD: 'dashboard',
  MOVIES: 'movies',
  MOVIES_NEW: 'new',
  MOVIES_EDIT: ':id/edit',
  ARTISTS: 'artists',
  ARTISTS_NEW: 'new',
  ARTISTS_EDIT: ':id/edit',
  USERS: 'users',
  USER_DETAIL: ':id',
  ML_MODEL: 'ml-model',
} as const;

export const ProfileRoutes = {
  OVERVIEW: '',
  WATCHLIST: 'watchlist',
  RATINGS: 'ratings',
  REVIEWS: 'reviews',
} as const;

export const AppPaths = {
  ROOT: '/',
  DISCOVER: '/',
  MOVIES: `/${AppRoutes.MOVIES}`,
  ARTISTS: `/${AppRoutes.ARTISTS}`,
  SEARCH: `/${AppRoutes.SEARCH}`,
  PROFILE: `/${AppRoutes.PROFILE}`,
  USERS: `/${AppRoutes.USERS}`,
  ADMIN: `/${AppRoutes.ADMIN}`,
  ONBOARDING: `/${AppRoutes.ONBOARDING}`,
  RULES: `/${AppRoutes.RULES}`,
  NOT_FOUND: `/${AppRoutes.NOT_FOUND}`,
  ERROR: `/${AppRoutes.ERROR}`,
} as const;

export const AuthPaths = {
  LOGIN: `/${AppRoutes.AUTH}/${AuthRoutes.LOGIN}`,
  REGISTER: `/${AppRoutes.AUTH}/${AuthRoutes.REGISTER}`,
  VERIFY_EMAIL: `/${AppRoutes.AUTH}/${AuthRoutes.VERIFY_EMAIL}`,
  FORGOT_PASSWORD: `/${AppRoutes.AUTH}/${AuthRoutes.FORGOT_PASSWORD}`,
  RESET_PASSWORD: `/${AppRoutes.AUTH}/${AuthRoutes.RESET_PASSWORD}`,
} as const;

export const AdminPaths = {
  DASHBOARD: `/${AppRoutes.ADMIN}/${AdminRoutes.DASHBOARD}`,
  MOVIES: `/${AppRoutes.ADMIN}/${AdminRoutes.MOVIES}`,
  MOVIES_NEW: `/${AppRoutes.ADMIN}/${AdminRoutes.MOVIES}/${AdminRoutes.MOVIES_NEW}`,
  ARTISTS: `/${AppRoutes.ADMIN}/${AdminRoutes.ARTISTS}`,
  ARTISTS_NEW: `/${AppRoutes.ADMIN}/${AdminRoutes.ARTISTS}/${AdminRoutes.ARTISTS_NEW}`,
  USERS: `/${AppRoutes.ADMIN}/${AdminRoutes.USERS}`,
  ML_MODEL: `/${AppRoutes.ADMIN}/${AdminRoutes.ML_MODEL}`,
} as const;
