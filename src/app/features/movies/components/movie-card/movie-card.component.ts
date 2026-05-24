import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, Input, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Movie } from '../../../../core/models/movie';
import { AppIcon } from '../../../../core/constants/app-icons';
import { AppRoutes } from '../../../../core/constants/app-routes';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WatchlistService } from '../../../../core/services/watchlist.service';

// Maps the engine's English reason labels to i18n keys. Unknown reasons fall
// through as raw text (the translate pipe returns the input on miss).
const REASON_KEY: Record<string, string> = {
  'Recommended for you': 'MOVIE.REASON.FOR_YOU',
  'Similar movie': 'MOVIE.REASON.SIMILAR',
  'Because you watched': 'MOVIE.REASON.BECAUSE_WATCHED',
  'Popular in your genres': 'MOVIE.REASON.POPULAR_IN_GENRES',
  'Top rated': 'MOVIE.REASON.TOP_RATED',
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
    return REASON_KEY[r] ?? r;
  }

  // Toggles the watchlist "Plan to Watch" status. Optimistic UI: flip state
  // immediately, revert if the request fails. The heart's initial state isn't
  // synced from the server — that would require either a per-card watchlist
  // fetch (N+1) or a watchlist field on the list-item DTO.
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
