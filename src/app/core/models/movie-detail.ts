import { MovieCast } from './movie-cast';
import { Season } from './season';
import { TitleType } from './title-type';

export interface MovieDetail {
  id: string;
  key: string;
  type: TitleType;
  title: string;
  originalTitle: string;
  tagline: string | null;
  overview: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  trailerYoutubeId: string | null;
  releaseDate: string | null;
  runtime: number | null;
  seasonsCount: number | null;
  episodesCount: number | null;
  isOngoing: boolean | null;
  originalLang: string;
  status: string;
  voteAverage: number;
  voteCount: number;
  imdbId: string | null;
  tmdbId: number | null;
  genres: string[];
  keywords: string[];
  casts: MovieCast[];
  seasons: Season[];
}
