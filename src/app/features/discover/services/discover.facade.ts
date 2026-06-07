import { DestroyRef, Injectable } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, catchError, distinctUntilChanged, map, of, switchMap } from 'rxjs';
import { Movie } from '../../../core/models/movie';
import { AuthService } from '../../../core/services/auth.service';
import { DiscoverSection, emptySection } from '../models/discover-section.model';
import { DiscoverApiService } from './discover-api.service';

@Injectable({ providedIn: 'root' })
export class DiscoverFacade {
  private readonly _forYou$ = new BehaviorSubject<DiscoverSection>(emptySection);
  private readonly _trendingMovies$ = new BehaviorSubject<DiscoverSection>(emptySection);
  private readonly _trendingSeries$ = new BehaviorSubject<DiscoverSection>(emptySection);
  private readonly _popular$ = new BehaviorSubject<DiscoverSection>(emptySection);

  private readonly _featured$ = new BehaviorSubject<Movie | null>(null);

  public readonly forYou$ = this._forYou$.asObservable();
  public readonly trendingMovies$ = this._trendingMovies$.asObservable();
  public readonly trendingSeries$ = this._trendingSeries$.asObservable();
  public readonly popular$ = this._popular$.asObservable();
  public readonly featured$ = this._featured$.asObservable();

  public constructor(
    private readonly api: DiscoverApiService,
    private readonly auth: AuthService,
    private readonly destroyRef: DestroyRef,
  ) {
    this.auth.user$
      .pipe(
        map((u) => u?.id ?? null),
        distinctUntilChanged(),
        switchMap((userId) => this.loadForYouStream(userId !== null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((section) => this._forYou$.next(section));
  }

  public load(): void {
    this.loadTrendingMovies();
    this.loadTrendingSeries();
    this.loadPopular();
    // "For You" is driven reactively from the auth.user$ subscription in the constructor,
    // so it is intentionally not re-fetched here (that produced a duplicate request).
  }

  private loadForYouStream(isAuthenticated: boolean): Observable<DiscoverSection> {
    if (!isAuthenticated) {
      return of<DiscoverSection>({ status: 'empty', items: [] });
    }
    return this.api.getForYou(20).pipe(
      switchMap((movies) =>
        movies.length > 0
          ? of<DiscoverSection>({ status: 'ready', items: movies })
          : this.api.getColdStart(20).pipe(
              map((cold) => ({
                status: cold.length === 0 ? 'empty' : 'ready',
                items: cold,
              }) as DiscoverSection),
            ),
      ),
      catchError(() => of<DiscoverSection>({ status: 'error', items: [] })),
    );
  }

  private loadTrendingMovies(): void {
    this._trendingMovies$.next(emptySection);
    this.api
      .getTrendingMovies(7, 20)
      .pipe(catchError(() => this.markError(this._trendingMovies$)), takeUntilDestroyed(this.destroyRef))
      .subscribe((movies) => {
        this._trendingMovies$.next({
          status: movies.length === 0 ? 'empty' : 'ready',
          items: movies,
        });
        this.maybeSetFeatured(movies);
      });
  }

  private loadTrendingSeries(): void {
    this._trendingSeries$.next(emptySection);
    this.api
      .getTrendingSeries(7, 20)
      .pipe(catchError(() => this.markError(this._trendingSeries$)), takeUntilDestroyed(this.destroyRef))
      .subscribe((movies) => {
        this._trendingSeries$.next({
          status: movies.length === 0 ? 'empty' : 'ready',
          items: movies,
        });
      });
  }

  private loadPopular(): void {
    this._popular$.next(emptySection);
    this.api
      .getPopular({ count: 20 })
      .pipe(catchError(() => this.markError(this._popular$)), takeUntilDestroyed(this.destroyRef))
      .subscribe((movies) => {
        this._popular$.next({
          status: movies.length === 0 ? 'empty' : 'ready',
          items: movies,
        });
        this.maybeSetFeatured(movies);
      });
  }

  private maybeSetFeatured(candidates: Movie[]): void {
    if (this._featured$.value) return;
    const eligible = candidates.find((m) => !!m.backdropUrl);
    if (eligible) {
      this._featured$.next(eligible);
    }
  }

  private markError(subject: BehaviorSubject<DiscoverSection>): Observable<Movie[]> {
    subject.next({ status: 'error', items: [] });
    return of<Movie[]>([]);
  }
}
