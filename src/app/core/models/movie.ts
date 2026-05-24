import { TitleType } from './title-type';

export interface Movie {
  id: string;
  key: string;
  type: TitleType;
  title: string;
  originalTitle: string;
  overview: string | null;
  status: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  rating: number;
  releaseDate: string | null;
  runtime: number | null;
  seasonsCount: number | null;
  episodesCount: number | null;
  isOngoing: boolean | null;
  genres: string[];

  // Set by recommendation endpoints (for-you / cold-start / because-you-liked).
  // Null for catalogue / search results. Used to render a "why-recommended"
  // tooltip on the discover home page.
  recommendationReason?: string | null;
}
