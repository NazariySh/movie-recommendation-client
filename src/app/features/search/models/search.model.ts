import { MovieListItem } from '../../../core/models/movie-list-item';
import { TitleType } from '../../../core/models/title-type';

export interface MovieSuggestion {
  id: string;
  key: string;
  type: TitleType;
  title: string;
  releaseYear: number | null;
  posterUrl: string | null;
}

export interface ArtistSuggestion {
  id: string;
  slug: string;
  name: string;
  photoUrl: string | null;
  knownFor: string | null;
}

export interface SearchSuggestions {
  movies: MovieSuggestion[];
  artists: ArtistSuggestion[];
}

export interface SearchCounts {
  total: number;
  movies: number;
  series: number;
  artists: number;
}

export type SearchTab = 'all' | 'movies' | 'series' | 'artists';

export type SearchMode = 'keyword' | 'semantic';

export interface SemanticSearchMoviesResult {
  items: MovieListItem[];
  query: string;
  total: number;
}
