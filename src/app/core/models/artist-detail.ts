import { Filmography } from './filmography';

export interface ArtistDetail {
  id: string;
  slug: string;
  name: string;
  photoUrl: string | null;
  birthday: string | null;
  dateOfDeath: string | null;
  placeOfBirth: string | null;
  nationality: string | null;
  gender: string | null;
  knownForDepartment: string | null;
  biography: string | null;
  imdbId: string | null;
  tmdbId: number | null;
  roles: string[];
  filmography: Filmography;
}
