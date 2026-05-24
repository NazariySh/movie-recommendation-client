export interface Rating {
  movieId: string;
  score: number;
  updatedAt: string;
}

export interface UserRating {
  movieId: string;
  movieKey: string;
  movieTitle: string;
  posterUrl: string | null;
  score: number;
  updatedAt: string;
}
