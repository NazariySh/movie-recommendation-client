import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, Observable, combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { Artist } from '../../../../core/models/artist';
import { MovieListItem } from '../../../../core/models/movie-list-item';
import { PagedList } from '../../../../core/models/paged-list';
import {
  SearchCounts,
  SearchMode,
  SearchTab,
  SemanticSearchMoviesResult,
} from '../../models/search.model';
import { SearchApiService } from '../../services/search-api.service';
import { SearchHistoryService } from '../../services/search-history.service';

const PAGE_SIZE = 20;
const SEMANTIC_LIMIT = 40;

interface SearchParams {
  query: string;
  mode: SearchMode;
  activeTab: SearchTab;
  page: number;
}

export interface SearchPageState {
  query: string;
  mode: SearchMode;
  activeTab: SearchTab;
  page: number;
  counts: SearchCounts;
  movies: PagedList<MovieListItem> | null;
  series: PagedList<MovieListItem> | null;
  artists: PagedList<Artist> | null;
  semantic: SemanticSearchMoviesResult | null;
}

const EMPTY_COUNTS: SearchCounts = { total: 0, movies: 0, series: 0, artists: 0 };

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchPageComponent implements OnInit {
  public readonly loading$ = new BehaviorSubject<boolean>(false);

  public state$!: Observable<SearchPageState>;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly api: SearchApiService,
    private readonly history: SearchHistoryService,
  ) {}

  public ngOnInit(): void {
    this.state$ = this.initTableStream();
  }

  public selectTab(tab: SearchTab): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { tab, page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  public selectMode(mode: SearchMode): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { mode, tab: 'all', page: 1 },
      queryParamsHandling: 'merge',
    });
  }

  public goToPage(page: number): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { page },
      queryParamsHandling: 'merge',
    });
  }

  public showMovies(activeTab: SearchTab): boolean {
    return activeTab === 'all' || activeTab === 'movies';
  }

  public showSeries(activeTab: SearchTab): boolean {
    return activeTab === 'all' || activeTab === 'series';
  }

  public showArtists(activeTab: SearchTab): boolean {
    return activeTab === 'all' || activeTab === 'artists';
  }

  public similarityPercent(score: number): number {
    return Math.round(score * 100);
  }

  private initTableStream(): Observable<SearchPageState> {
    const params$: Observable<SearchParams> = this.route.queryParamMap.pipe(
      map((p): SearchParams => ({
        query: p.get('q')?.trim() ?? '',
        mode: p.get('mode') === 'semantic' ? 'semantic' : 'keyword',
        activeTab: (p.get('tab') as SearchTab) || 'all',
        page: Number(p.get('page')) || 1,
      })),
      distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)),
      tap((p) => {
        if (p.query.length >= 2) {
          this.history.add(p.query);
        }
      }),
    );

    return params$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((p) => {
        if (p.query.length < 2) {
          return of<SearchPageState>(this.emptyState(p));
        }
        if (p.mode === 'semantic') {
          return this.api.searchSemantic(p.query, SEMANTIC_LIMIT).pipe(
            map((semantic) => ({
              ...p,
              counts: EMPTY_COUNTS,
              movies: null,
              series: null,
              artists: null,
              semantic,
            })),
            catchError(() => of<SearchPageState>(this.emptyState(p))),
          );
        }
        return this.api.getCounts(p.query).pipe(
          switchMap((counts) =>
            this.fetchTabs(p).pipe(
              map((tabs) => ({ ...p, counts, ...tabs, semantic: null })),
            ),
          ),
          catchError(() => of<SearchPageState>(this.emptyState(p))),
        );
      }),
      tap(() => this.loading$.next(false)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  private fetchTabs(params: SearchParams): Observable<{
    movies: PagedList<MovieListItem> | null;
    series: PagedList<MovieListItem> | null;
    artists: PagedList<Artist> | null;
  }> {
    const all = params.activeTab === 'all';

    const movies$ = all || params.activeTab === 'movies'
      ? this.api.searchMovies(params.query, 'Movie', params.page, PAGE_SIZE).pipe(
          catchError(() => of<PagedList<MovieListItem> | null>(null)),
        )
      : of<PagedList<MovieListItem> | null>(null);

    const series$ = all || params.activeTab === 'series'
      ? this.api.searchMovies(params.query, 'Series', params.page, PAGE_SIZE).pipe(
          catchError(() => of<PagedList<MovieListItem> | null>(null)),
        )
      : of<PagedList<MovieListItem> | null>(null);

    const artists$ = all || params.activeTab === 'artists'
      ? this.api.searchArtists(params.query, params.page, PAGE_SIZE).pipe(
          catchError(() => of<PagedList<Artist> | null>(null)),
        )
      : of<PagedList<Artist> | null>(null);

    return combineLatest([movies$, series$, artists$]).pipe(
      map(([movies, series, artists]) => ({ movies, series, artists })),
    );
  }

  private emptyState(params: SearchParams): SearchPageState {
    return {
      ...params,
      counts: EMPTY_COUNTS,
      movies: null,
      series: null,
      artists: null,
      semantic: null,
    };
  }
}
