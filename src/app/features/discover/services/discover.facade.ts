import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, of, take } from 'rxjs';
import { Movie } from '../../../core/models/movie';
import { AuthService } from '../../../core/services/auth.service';
import { DiscoverSection } from '../models/discover-section.model';
import { DiscoverApiService } from './discover-api.service';

@Injectable({ providedIn: 'root' })
export class DiscoverFacade {
  private readonly _forYou$ = new BehaviorSubject<DiscoverSection>({ status: 'loading', items: [] });
  private readonly _trendingMovies$ = new BehaviorSubject<DiscoverSection>({ status: 'loading', items: [] });
  private readonly _trendingSeries$ = new BehaviorSubject<DiscoverSection>({ status: 'loading', items: [] });
  private readonly _popular$ = new BehaviorSubject<DiscoverSection>({ status: 'loading', items: [] });

  private readonly _featured$ = new BehaviorSubject<Movie | null>(null);

  public readonly forYou$ = this._forYou$.asObservable();
  public readonly trendingMovies$ = this._trendingMovies$.asObservable();
  public readonly trendingSeries$ = this._trendingSeries$.asObservable();
  public readonly popular$ = this._popular$.asObservable();
  public readonly featured$ = this._featured$.asObservable();

  constructor(
    private readonly api: DiscoverApiService,
    private readonly auth: AuthService,
  ) {}

  public load(): void {
    this.auth.user$.pipe(take(1)).subscribe((user) => {
      if (user) {
        this.loadForYou();
      } else {
        this._forYou$.next({ status: 'empty', items: [] });
      }

      this.loadTrendingMovies();
      this.loadTrendingSeries();
      this.loadPopular();
    });
  }

  private loadForYou(): void {
    this._forYou$.next({ status: 'loading', items: [] });
    this.api
      .getForYou(20)
      .pipe(
        catchError(() => {
          this._forYou$.next({ status: 'error', items: [] });
          return of<Movie[]>([]);
        }),
      )
      .subscribe((movies) => {
        if (movies.length > 0) {
          this._forYou$.next({ status: 'ready', items: movies });
          return;
        }

        // No personalised recs yet (new user, or fewer than ColdStartRatingThreshold
        // ratings). Try the cold-start endpoint — it returns Bayesian-weighted top
        // picks scoped to the user's onboarding genre preferences. Only fall through
        // to the static CTA if that's empty too (effectively empty catalogue).
        this.api
          .getColdStart(20)
          .pipe(catchError(() => of<Movie[]>([])))
          .subscribe((cold) => {
            this._forYou$.next({
              status: cold.length === 0 ? 'empty' : 'ready',
              items: cold,
            });
          });
      });
  }

  private loadTrendingMovies(): void {
    this._trendingMovies$.next({ status: 'loading', items: [] });
    this.api
      .getTrendingMovies(7, 20)
      .pipe(catchError(() => this.markError(this._trendingMovies$)))
      .subscribe((movies) => {
        this._trendingMovies$.next({
          status: movies.length === 0 ? 'empty' : 'ready',
          items: movies,
        });
        this.maybeSetFeatured(movies);
      });
  }

  private loadTrendingSeries(): void {
    this._trendingSeries$.next({ status: 'loading', items: [] });
    this.api
      .getTrendingSeries(7, 20)
      .pipe(catchError(() => this.markError(this._trendingSeries$)))
      .subscribe((movies) => {
        this._trendingSeries$.next({
          status: movies.length === 0 ? 'empty' : 'ready',
          items: movies,
        });
      });
  }

  private loadPopular(): void {
    this._popular$.next({ status: 'loading', items: [] });
    this.api
      .getPopular({ count: 20 })
      .pipe(catchError(() => this.markError(this._popular$)))
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
