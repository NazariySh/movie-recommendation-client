import { TitleType } from './title-type';

export type RecommendationReason =
  | 'ForYou'
  | 'Similar'
  | 'BecauseWatched'
  | 'PopularInGenres'
  | 'TopRated'
  | 'SemanticMatch';

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

  recommendationReason?: RecommendationReason | null;
}
