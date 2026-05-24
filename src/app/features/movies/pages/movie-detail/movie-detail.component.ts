import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { Observable, combineLatest, of } from 'rxjs';
import { catchError, distinctUntilChanged, map, shareReplay, switchMap, tap } from 'rxjs/operators';
import { MovieDetail } from '../../../../core/models/movie-detail';
import { MovieListItem } from '../../../../core/models/movie-list-item';
import { Movie } from '../../../../core/models/movie';
import { MovieCast } from '../../../../core/models/movie-cast';
import { Season } from '../../../../core/models/season';
import { AppIcon } from '../../../../core/constants/app-icons';
import { AppRoutes, AuthPaths } from '../../../../core/constants/app-routes';
import { MovieService } from '../../services/movie.service';
import { DiscoverApiService } from '../../../discover/services/discover-api.service';
import { TrailerDialogComponent } from '../../components/trailer-dialog/trailer-dialog.component';
import { RatingService } from '../../../../core/services/rating.service';
import { WatchlistService } from '../../../../core/services/watchlist.service';
import { ToastService } from '../../../../core/services/toast.service';
import { AuthService } from '../../../../core/services/auth.service';
import { LanguageService } from '../../../../core/services/language.service';
import { Rating } from '../../../../core/models/rating';
import { WatchlistStatus } from '../../../../core/models/watchlist';

type DetailTab = 'information' | 'episodes' | 'similar' | 'reviews';

interface DetailTabDef {
  id: DetailTab;
  labelKey: string;
  seriesOnly?: boolean;
}

interface WatchlistOption {
  status: WatchlistStatus;
  labelKey: string;
}

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrl: './movie-detail.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailComponent implements OnInit {
  public readonly AppIcon = AppIcon;

  public readonly detailTabs: DetailTabDef[] = [
    { id: 'information', labelKey: 'MOVIE.TAB.INFORMATION' },
    { id: 'episodes', labelKey: 'MOVIE.TAB.EPISODES', seriesOnly: true },
    { id: 'similar', labelKey: 'MOVIE.TAB.SIMILAR' },
    { id: 'reviews', labelKey: 'MOVIE.TAB.REVIEWS' },
  ];

  public readonly watchlistOptions: WatchlistOption[] = [
    { status: 'PlanToWatch', labelKey: 'WATCHLIST.PLAN_TO_WATCH' },
    { status: 'Watching', labelKey: 'WATCHLIST.WATCHING' },
    { status: 'Completed', labelKey: 'WATCHLIST.COMPLETED' },
    { status: 'Dropped', labelKey: 'WATCHLIST.DROPPED' },
  ];

  public activeTab: DetailTab = 'information';
  public movie$!: Observable<MovieDetail | null>;
  public notFound = false;
  public similar: MovieListItem[] = [];
  public becauseYouLiked: Movie[] = [];

  public isAuthenticated = false;
  public myRating: number | null = null;
  public ratingPending = false;
  public watchlistStatus: WatchlistStatus | null = null;
  public watchlistPending = false;

  public draftRating = 7;

  public seasons: Season[] = [];

  private currentMovieId: string | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly location: Location,
    private readonly movieService: MovieService,
    private readonly ratingService: RatingService,
    private readonly watchlistService: WatchlistService,
    private readonly authService: AuthService,
    private readonly languageService: LanguageService,
    private readonly toastService: ToastService,
    private readonly discoverApi: DiscoverApiService,
    private readonly dialog: MatDialog,
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => (this.isAuthenticated = value));

    this.movie$ = combineLatest([
      this.route.paramMap.pipe(map((p) => p.get('id')), distinctUntilChanged()),
      this.languageService.lang$.pipe(distinctUntilChanged()),
    ]).pipe(
      switchMap(([id]) => {
        if (!id) {
          return of<MovieDetail | null>(null);
        }
        return this.movieService.getMovieByKey(id).pipe(
          catchError(() => of<MovieDetail | null>(null)),
        );
      }),
      tap((movie) => {
        this.notFound = movie === null;
        if (!movie) {
          this.cdr.markForCheck();
          return;
        }
        this.currentMovieId = movie.id;
        this.seasons = [...(movie.seasons ?? [])];
        this.syncActiveTab(movie);
        this.applySeoTags(movie);
        this.loadSimilar(movie.id);
        this.loadInteractionState(movie.id);
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }

  public tabsFor(movie: MovieDetail): DetailTabDef[] {
    return this.detailTabs.filter((tab) => !tab.seriesOnly || movie.type === 'Series');
  }

  public setTab(tab: DetailTab): void {
    this.activeTab = tab;
  }

  private syncActiveTab(movie: MovieDetail): void {
    if (this.activeTab === 'episodes' && movie.type !== 'Series') {
      this.activeTab = 'information';
    }
  }

  public goBack(): void {
    this.location.back();
  }

  public openTrailer(movie: MovieDetail): void {
    if (!movie.trailerYoutubeId) {
      return;
    }

    this.dialog.open(TrailerDialogComponent, {
      data: { youtubeId: movie.trailerYoutubeId, title: movie.title },
      panelClass: 'trailer-panel',
      width: 'min(1100px, 92vw)',
      maxWidth: '92vw',
      ariaLabelledBy: 'trailer-dialog-title',
      autoFocus: 'first-tabbable',
      restoreFocus: true,
    });
  }

  public navigateToMovie(id: string): void {
    this.router.navigate(['/', AppRoutes.MOVIE_DETAIL, id]);
  }

  public navigateToArtist(personId: string): void {
    this.router.navigate(['/', AppRoutes.ARTISTS, personId]);
  }

  public castOnly(movie: MovieDetail): MovieCast[] {
    return movie.casts
      .filter((c) => c.role.toLowerCase() === 'acting')
      .sort((a, b) => (a.castOrder ?? 99) - (b.castOrder ?? 99))
      .slice(0, 12);
  }

  public director(movie: MovieDetail): MovieCast | undefined {
    return movie.casts.find(
      (c) => c.role.toLowerCase() === 'directing' || c.role.toLowerCase() === 'director',
    );
  }

  public crew(movie: MovieDetail): MovieCast[] {
    return movie.casts.filter((c) => c.role.toLowerCase() !== 'acting');
  }

  public submitRating(value: number): void {
    if (this.currentMovieId === null || this.ratingPending) {
      return;
    }

    const previous = this.myRating;
    this.myRating = value;
    this.ratingPending = true;

    this.ratingService.upsertRating(this.currentMovieId, value).subscribe({
      next: () => {
        this.ratingPending = false;
        this.toastService.success('MOVIE.RATING_SAVED');
        this.cdr.markForCheck();
      },
      error: () => {
        this.myRating = previous;
        this.ratingPending = false;
        this.toastService.error('ERRORS.GENERIC');
        this.cdr.markForCheck();
      },
    });
  }

  public clearRating(): void {
    if (this.currentMovieId === null || this.myRating === null || this.ratingPending) {
      return;
    }

    const previous = this.myRating;
    this.myRating = null;
    this.ratingPending = true;

    this.ratingService.deleteRating(this.currentMovieId).subscribe({
      next: () => {
        this.ratingPending = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.myRating = previous;
        this.ratingPending = false;
        this.toastService.error('ERRORS.GENERIC');
        this.cdr.markForCheck();
      },
    });
  }

  public promptLoginForWatchlist(): void {
    this.router.navigate([AuthPaths.LOGIN], {
      queryParams: { returnUrl: this.router.url },
    });
  }

  public setWatchlistStatus(status: WatchlistStatus): void {
    if (this.currentMovieId === null || this.watchlistPending) {
      return;
    }

    const movieId = this.currentMovieId;
    const previous = this.watchlistStatus;
    this.watchlistStatus = status;
    this.watchlistPending = true;

    const op$ = previous === null
      ? this.watchlistService.upsert({ movieId, status })
      : this.watchlistService.updateStatus(movieId, { status });

    op$.subscribe({
      next: () => {
        this.watchlistPending = false;
        this.toastService.success('WATCHLIST.SAVED');
        this.cdr.markForCheck();
      },
      error: () => {
        this.watchlistStatus = previous;
        this.watchlistPending = false;
        this.toastService.error('ERRORS.GENERIC');
        this.cdr.markForCheck();
      },
    });
  }

  public removeFromWatchlist(): void {
    if (this.currentMovieId === null || this.watchlistStatus === null || this.watchlistPending) {
      return;
    }

    const previous = this.watchlistStatus;
    this.watchlistStatus = null;
    this.watchlistPending = true;

    this.watchlistService.remove(this.currentMovieId).subscribe({
      next: () => {
        this.watchlistPending = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.watchlistStatus = previous;
        this.watchlistPending = false;
        this.toastService.error('ERRORS.GENERIC');
        this.cdr.markForCheck();
      },
    });
  }

  public watchlistLabelKey(): string {
    if (this.watchlistStatus === null) {
      return 'MOVIE.ADD_TO_WATCHLIST';
    }

    const match = this.watchlistOptions.find((o) => o.status === this.watchlistStatus);
    return match?.labelKey ?? 'MOVIE.ADD_TO_WATCHLIST';
  }

  private loadInteractionState(movieId: string): void {
    if (!this.isAuthenticated) {
      this.myRating = null;
      this.watchlistStatus = null;
      return;
    }

    this.ratingService
      .getMyRating(movieId)
      .pipe(
        catchError(() => of<Rating | null>(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((rating) => {
        this.myRating = rating?.score ?? null;
        this.draftRating = Math.round(rating?.score ?? 7);
        this.cdr.markForCheck();
      });

    this.watchlistService
      .getMyWatchlist(undefined, 1, 100)
      .pipe(
        catchError(() => of(null)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((page) => {
        const item = page?.items.find((w) => w.movieId === movieId);
        this.watchlistStatus = item?.status ?? null;
        this.cdr.markForCheck();
      });
  }

  private loadSimilar(id: string): void {
    this.movieService
      .getSimilar(id, 12)
      .pipe(
        catchError(() => of<MovieListItem[]>([])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((items) => {
        this.similar = items;
        this.cdr.markForCheck();
      });

    // Personalised companion to the impersonal Similar rail — blends CF with
    // embedding similarity to the current movie and excludes the user's
    // already-rated / completed titles. Only meaningful when authenticated.
    if (!this.isAuthenticated) {
      this.becauseYouLiked = [];
      return;
    }
    this.discoverApi
      .getBecauseYouLiked(id, 12)
      .pipe(
        catchError(() => of<Movie[]>([])),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((items) => {
        this.becauseYouLiked = items;
        this.cdr.markForCheck();
      });
  }

  private applySeoTags(movie: MovieDetail): void {
    const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null;
    const titleSuffix = year ? ` (${year})` : '';
    this.title.setTitle(`${movie.title}${titleSuffix} — MovieMatch`);

    const description = (movie.overview ?? '').substring(0, 160);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: movie.title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({
      property: 'og:type',
      content: movie.type === 'Series' ? 'video.tv_show' : 'video.movie',
    });

    if (movie.backdropUrl) {
      this.meta.updateTag({ property: 'og:image', content: movie.backdropUrl });
    } else {
      this.meta.removeTag('property="og:image"');
    }
  }
}
