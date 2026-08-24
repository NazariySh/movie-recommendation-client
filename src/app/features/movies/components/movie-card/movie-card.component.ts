import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Movie, RecommendationReason } from '../../../../core/models/movie';
import { AppIcon } from '../../../../core/constants/app-icons';
import { AppRoutes } from '../../../../core/constants/app-routes';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WatchlistService } from '../../../../core/services/watchlist.service';

const REASON_KEY: Record<RecommendationReason, string> = {
  ForYou: 'MOVIE.REASON.FOR_YOU',
  Similar: 'MOVIE.REASON.SIMILAR',
  BecauseWatched: 'MOVIE.REASON.BECAUSE_WATCHED',
  PopularInGenres: 'MOVIE.REASON.POPULAR_IN_GENRES',
  TopRated: 'MOVIE.REASON.TOP_RATED',
  SemanticMatch: 'MOVIE.REASON.SEMANTIC_MATCH',
};

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCardComponent implements OnInit {
  public readonly AppIcon = AppIcon;
  public readonly AppRoutes = AppRoutes;

  @Input() public movie!: Movie;

  public isHovered = false;
  public isFavorite = false;
  public favoritePending = false;
  public isAuthenticated = false;

  constructor(
    private readonly authService: AuthService,
    private readonly watchlistService: WatchlistService,
    private readonly toastService: ToastService,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.authService.isAuthenticated$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => {
        this.isAuthenticated = value;
        this.cdr.markForCheck();
      });
  }

  public get reasonI18n(): string | null {
    const r = this.movie?.recommendationReason;
    if (!r) return null;
    return REASON_KEY[r] ?? null;
  }

  public toggleFavorite(event: Event): void {
    event.stopPropagation();
    event.preventDefault();

    if (!this.isAuthenticated || this.favoritePending) {
      return;
    }

    const wasFavorite = this.isFavorite;
    this.isFavorite = !wasFavorite;
    this.favoritePending = true;

    const op$ = wasFavorite
      ? this.watchlistService.remove(this.movie.id)
      : this.watchlistService.upsert({ movieId: this.movie.id, status: 'PlanToWatch' });

    op$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.favoritePending = false;
        this.toastService.success(wasFavorite ? 'WATCHLIST.REMOVED' : 'WATCHLIST.SAVED');
        this.cdr.markForCheck();
      },
      error: () => {
        this.isFavorite = wasFavorite;
        this.favoritePending = false;
        this.toastService.error('ERRORS.GENERIC');
        this.cdr.markForCheck();
      },
    });
  }
}
