import { TitleType } from './title-type';

export interface FilmographyItem {
  movieId: string;
  movieKey: string;
  movieTitle: string;
  movieType: TitleType;
  releaseDate: string | null;
  posterUrl: string | null;
  role: string;
  character: string | null;
  castOrder: number | null;
  rating: number;
  genres: string[];
}

export interface Filmography {
  byRole: Record<string, FilmographyItem[]>;
}
