import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface FilterState {
  sortBy: 'popular' | 'top_rated' | 'newest' | 'oldest';
  genres: string[];
  minRating: number | null;
}

const DEFAULT_FILTERS: FilterState = {
  sortBy: 'popular',
  genres: [],
  minRating: null,
};

@Injectable({ providedIn: 'root' })
export class FilterService {
  private readonly state$ = new BehaviorSubject<FilterState>({ ...DEFAULT_FILTERS });

  public readonly filters$ = this.state$.asObservable();

  public get current(): FilterState {
    return this.state$.value;
  }

  public apply(state: FilterState): void {
    this.state$.next({ ...state });
  }

  public reset(): void {
    this.state$.next({ ...DEFAULT_FILTERS });
  }

  public isActive(): boolean {
    const f = this.state$.value;
    return f.sortBy !== DEFAULT_FILTERS.sortBy || f.genres.length > 0 || f.minRating !== null;
  }
}
