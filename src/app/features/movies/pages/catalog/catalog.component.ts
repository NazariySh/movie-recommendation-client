import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl } from '@angular/forms';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs/operators';
import { Genre } from '../../../../core/models/genre';
import { MovieListItem } from '../../../../core/models/movie-list-item';
import { PagedList } from '../../../../core/models/paged-list';
import { SelectItem } from '../../../../core/models/select-item';
import { SelectValue } from '../../../../shared/components/select/select.component';
import {
  PaginatorPageChange,
} from '../../../../shared/components/paginator/paginator.component';
import { TitleType } from '../../../../core/models/title-type';
import { AppIcon } from '../../../../core/constants/app-icons';
import {
  CatalogFilters,
  CatalogSort,
  SORT_OPTIONS,
} from '../../models/catalog-filters';
import { FiltersStateService } from '../../services/filters-state.service';
import { MovieService } from '../../services/movie.service';

interface TypeTab {
  id: 'all' | TitleType;
  labelKey: string;
}

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrl: './catalog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CatalogComponent implements OnInit {
  public readonly AppIcon = AppIcon;
  public readonly ratingMinBound = 0;
  public readonly ratingMaxBound = 10;
  public readonly skeletonSlots = Array.from({ length: 12 });

  public readonly typeTabs: TypeTab[] = [
    { id: 'all', labelKey: 'NAV.ALL' },
    { id: 'Movie', labelKey: 'NAV.MOVIES' },
    { id: 'Series', labelKey: 'NAV.SERIES' },
  ];

  public readonly sortItems: SelectItem[] = SORT_OPTIONS.map((o) => ({
    value: o.value,
    label: o.labelKey,
  }));

  public readonly yearItems: SelectItem[] = ((): SelectItem[] => {
    const current = new Date().getFullYear();
    const items: SelectItem[] = [];
    for (let y = current; y >= 1950; y--) {
      items.push({ value: y, label: String(y) });
    }
    return items;
  })();

  // URL is the single source of truth for filter state.
  public readonly filters$: Observable<CatalogFilters>;
  public readonly searchControl: FormControl<string>;
  public readonly genreItems$: Observable<SelectItem[]>;

  public readonly loading$ = new BehaviorSubject<boolean>(false);
  public readonly error$ = new BehaviorSubject<boolean>(false);

  public movies$!: Observable<PagedList<MovieListItem>>;

  constructor(
    private readonly filtersService: FiltersStateService,
    private readonly movieService: MovieService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.filters$ = this.filtersService.filters$;
    this.searchControl = new FormControl(this.filtersService.current().search, {
      nonNullable: true,
    });
    this.genreItems$ = this.movieService.getGenres().pipe(
      catchError(() => of<Genre[]>([])),
      map((genres) => genres.map((g): SelectItem => ({ value: g.slug, label: g.name }))),
      startWith([] as SelectItem[]),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  public ngOnInit(): void {
    this.searchControl.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged(),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((search) => this.filtersService.update({ search }));

    this.movies$ = this.initTableStream();
  }

  public setType(type: 'all' | TitleType): void {
    this.filtersService.update({ type });
  }

  public onSortChange(value: SelectValue): void {
    if (typeof value !== 'string') return;
    this.filtersService.update({ sort: value as CatalogSort });
  }

  public onGenresChange(value: SelectValue): void {
    const genres = Array.isArray(value) ? value.map(String) : [];
    this.filtersService.update({ genres });
  }

  public onYearsChange(value: SelectValue): void {
    const years = Array.isArray(value)
      ? value.map(Number).filter((n) => Number.isFinite(n)).sort((a, b) => a - b)
      : [];
    this.filtersService.update({ years });
  }

  public onRatingMinChange(event: Event): void {
    const v = Number((event.target as HTMLInputElement).value);
    this.filtersService.update({ minRating: v === this.ratingMinBound ? null : v });
  }

  public onRatingMaxChange(event: Event): void {
    const v = Number((event.target as HTMLInputElement).value);
    this.filtersService.update({ maxRating: v === this.ratingMaxBound ? null : v });
  }

  public removeGenre(slug: string): void {
    const current = this.filtersService.current();
    this.filtersService.update({ genres: current.genres.filter((s) => s !== slug) });
  }

  public removeYear(year: number): void {
    const current = this.filtersService.current();
    this.filtersService.update({ years: current.years.filter((y) => y !== year) });
  }

  public clearAll(): void {
    const current = this.filtersService.current();
    this.searchControl.setValue('', { emitEvent: false });
    this.filtersService.reset({ type: current.type });
  }

  public onPageChange(event: PaginatorPageChange): void {
    this.filtersService.update({ page: event.pageNumber });
  }

  public hasActiveFilters(f: CatalogFilters): boolean {
    return (
      !!f.search ||
      f.genres.length > 0 ||
      f.years.length > 0 ||
      f.yearFrom !== null ||
      f.yearTo !== null ||
      f.minRating !== null ||
      f.maxRating !== null ||
      f.runtimeMin !== null ||
      f.runtimeMax !== null ||
      !!f.language
    );
  }

  public movieSubtitle(movie: MovieListItem): string {
    const parts: string[] = [];
    if (movie.releaseYear) {
      parts.push(String(movie.releaseYear));
    }
    if (movie.genres.length) {
      parts.push(movie.genres[0]);
    }
    return parts.join(' · ');
  }

  private initTableStream(): Observable<PagedList<MovieListItem>> {
    return this.filters$.pipe(
      tap(() => {
        this.loading$.next(true);
        this.error$.next(false);
      }),
      switchMap((f) =>
        this.movieService.getCatalog(f).pipe(
          catchError(() => {
            this.error$.next(true);
            return of(this.emptyPage(f));
          }),
        ),
      ),
      tap(() => {
        this.loading$.next(false);
        if (typeof window !== 'undefined') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  private emptyPage(filters: CatalogFilters): PagedList<MovieListItem> {
    return {
      items: [],
      pageNumber: filters.page,
      pageSize: filters.pageSize,
      totalCount: 0,
      totalPages: 0,
    };
  }
}
