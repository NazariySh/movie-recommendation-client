import { TitleType } from '../../../core/models/title-type';

export type CatalogSort = 'popularity' | 'rating' | 'release_date' | 'newest' | 'title';

export type CatalogOrder = 'asc' | 'desc';

export interface CatalogFilters {
  search: string;
  type: 'all' | TitleType;
  genres: string[];
  years: number[];
  yearFrom: number | null;
  yearTo: number | null;
  minRating: number | null;
  maxRating: number | null;
  runtimeMin: number | null;
  runtimeMax: number | null;
  language: string | null;
  sort: CatalogSort;
  order: CatalogOrder;
  page: number;
  pageSize: number;
}

export const DEFAULT_FILTERS: CatalogFilters = {
  search: '',
  type: 'all',
  genres: [],
  years: [],
  yearFrom: null,
  yearTo: null,
  minRating: null,
  maxRating: null,
  runtimeMin: null,
  runtimeMax: null,
  language: null,
  sort: 'popularity',
  order: 'desc',
  page: 1,
  pageSize: 21,
};

export const PAGE_SIZE_OPTIONS = [21, 42, 63] as const;

export const SORT_OPTIONS: { value: CatalogSort; labelKey: string }[] = [
  { value: 'popularity', labelKey: 'CATALOG.SORT.POPULARITY' },
  { value: 'rating', labelKey: 'CATALOG.SORT.RATING' },
  { value: 'release_date', labelKey: 'CATALOG.SORT.RELEASE_DATE' },
  { value: 'newest', labelKey: 'CATALOG.SORT.NEWEST' },
  { value: 'title', labelKey: 'CATALOG.SORT.TITLE' },
];
