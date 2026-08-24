import { TitleType } from './title-type';

export interface MovieListItem {
  id: string;
  key: string;
  type: TitleType;
  title: string;
  originalTitle: string;
  overview: string | null;
  posterUrl: string | null;
  backdropUrl: string | null;
  releaseDate: string | null;
  releaseYear: number | null;
  runtime: number | null;
  originalLang: string;
  averageRating: number;
  ratingsCount: number;
  genres: string[];
}
