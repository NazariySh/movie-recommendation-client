import { Movie } from '../../../core/models/movie';

export type SectionStatus = 'loading' | 'ready' | 'empty' | 'error';

export interface DiscoverSection {
  status: SectionStatus;
  items: Movie[];
}

export const emptySection: DiscoverSection = { status: 'loading', items: [] };
