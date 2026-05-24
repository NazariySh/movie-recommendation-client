export interface Season {
  id: string;
  seasonNumber: number;
  name: string | null;
  overview: string | null;
  posterUrl: string | null;
  episodeCount: number;
  airDate: string | null;
  voteAverage: number | null;
}
