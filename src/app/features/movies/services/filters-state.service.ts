import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { distinctUntilChanged, map } from 'rxjs/operators';
import {
  CatalogFilters,
  CatalogOrder,
  CatalogSort,
  DEFAULT_FILTERS,
} from '../models/catalog-filters';

const SORT_VALUES: CatalogSort[] = ['popularity', 'rating', 'release_date', 'newest', 'title'];

@Injectable({ providedIn: 'root' })
export class FiltersStateService {
  public readonly filters$: Observable<CatalogFilters>;

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
  ) {
    this.filters$ = this.route.queryParams.pipe(
      map((params) => this.parse(params)),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
    );
  }

  public update(partial: Partial<CatalogFilters>): void {
    const current = this.parse(this.route.snapshot.queryParams);
    const next: CatalogFilters = { ...current, ...partial };

    const changedKeys = Object.keys(partial) as (keyof CatalogFilters)[];
    if (changedKeys.some((k) => k !== 'page' && k !== 'pageSize')) {
      next.page = 1;
    }

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.serialize(next),
      queryParamsHandling: 'merge',
      replaceUrl: false,
    });
  }

  public reset(keep?: Partial<CatalogFilters>): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.serialize({ ...DEFAULT_FILTERS, ...keep }),
    });
  }

  public replaceState(filters: CatalogFilters): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.serialize(filters),
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }

  public current(): CatalogFilters {
    return this.parse(this.route.snapshot.queryParams);
  }

  private parse(params: Params): CatalogFilters {
    const search = (params['search'] as string | undefined) ?? '';
    const typeRaw = (params['type'] as string | undefined) ?? 'all';
    const type = typeRaw === 'Movie' || typeRaw === 'Series' ? typeRaw : 'all';

    const genres =
      typeof params['genres'] === 'string' && params['genres'].length
        ? (params['genres'] as string).split(',').map((s) => s.trim()).filter(Boolean)
        : [];

    const years =
      typeof params['years'] === 'string' && params['years'].length
        ? (params['years'] as string)
            .split(',')
            .map((s) => Number(s.trim()))
            .filter((n) => Number.isFinite(n))
        : [];

    const sortRaw = (params['sort'] as string | undefined)?.toLowerCase();
    const sort: CatalogSort = SORT_VALUES.includes(sortRaw as CatalogSort)
      ? (sortRaw as CatalogSort)
      : DEFAULT_FILTERS.sort;

    const orderRaw = (params['order'] as string | undefined)?.toLowerCase();
    const order: CatalogOrder = orderRaw === 'asc' ? 'asc' : 'desc';

    return {
      search,
      type,
      genres,
      years,
      yearFrom: this.toNumber(params['yearFrom']),
      yearTo: this.toNumber(params['yearTo']),
      minRating: this.toNumber(params['minRating']),
      maxRating: this.toNumber(params['maxRating']),
      runtimeMin: this.toNumber(params['runtimeMin']),
      runtimeMax: this.toNumber(params['runtimeMax']),
      language: typeof params['language'] === 'string' && params['language'] ? params['language'] : null,
      sort,
      order,
      page: this.toNumber(params['page']) ?? 1,
      pageSize: this.toNumber(params['pageSize']) ?? DEFAULT_FILTERS.pageSize,
    };
  }

  private serialize(filters: CatalogFilters): Params {
    return {
      search: filters.search || null,
      type: filters.type === 'all' ? null : filters.type,
      genres: filters.genres.length ? filters.genres.join(',') : null,
      years: filters.years.length ? filters.years.join(',') : null,
      yearFrom: filters.yearFrom,
      yearTo: filters.yearTo,
      minRating: filters.minRating,
      maxRating: filters.maxRating,
      runtimeMin: filters.runtimeMin,
      runtimeMax: filters.runtimeMax,
      language: filters.language,
      sort: filters.sort === DEFAULT_FILTERS.sort ? null : filters.sort,
      order: filters.order === DEFAULT_FILTERS.order ? null : filters.order,
      page: filters.page === 1 ? null : filters.page,
      pageSize: filters.pageSize === DEFAULT_FILTERS.pageSize ? null : filters.pageSize,
    };
  }

  private toNumber(value: unknown): number | null {
    if (value === null || value === undefined || value === '') {
      return null;
    }

    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }
}
