export type WatchlistStatus = 'PlanToWatch' | 'Watching' | 'Completed' | 'Dropped';

export interface WatchlistItem {
  movieId: string;
  movieKey: string;
  movieTitle: string;
  posterUrl: string | null;
  status: WatchlistStatus;
  watchedAt: string | null;
  notes: string | null;
  updatedAt: string;
}

export interface UpsertWatchlistRequest {
  movieId: string;
  status: WatchlistStatus;
  notes?: string | null;
}

export interface UpdateWatchlistStatusRequest {
  status: WatchlistStatus;
  notes?: string | null;
}
