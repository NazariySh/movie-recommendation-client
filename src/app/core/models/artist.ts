export interface Artist {
  id: string;
  slug: string;
  name: string;
  photoUrl: string | null;
  knownForDepartment: string | null;
  roles: string[];
  movieCount: number;
}
