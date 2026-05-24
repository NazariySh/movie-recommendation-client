import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AppRoutes } from '../../../../core/constants/app-routes';
import { PagedList } from '../../../../core/models/paged-list';
import { WatchlistItem, WatchlistStatus } from '../../../../core/models/watchlist';
import { ToastService } from '../../../../core/services/toast.service';
import { WatchlistService } from '../../../../core/services/watchlist.service';

const STATUSES: WatchlistStatus[] = ['PlanToWatch', 'Watching', 'Completed', 'Dropped'];
const PAGE_SIZE = 20;

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrl: './watchlist-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WatchlistPageComponent implements OnInit {
  public readonly statuses = STATUSES;
  public readonly counts = new Map<WatchlistStatus, number>();
  public readonly pages = new Map<WatchlistStatus, PagedList<WatchlistItem> | null>();
  public readonly loading = new Map<WatchlistStatus, boolean>();

  public activeStatus: WatchlistStatus = 'PlanToWatch';
  public activePage = 1;

  constructor(
    private readonly api: WatchlistService,
    private readonly router: Router,
    private readonly toast: ToastService,
    private readonly translate: TranslateService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    STATUSES.forEach((s) => {
      this.pages.set(s, null);
      this.loading.set(s, false);
    });
  }

  public ngOnInit(): void {
    this.fetchAll();
  }

  public selectStatus(status: WatchlistStatus): void {
    this.activeStatus = status;
    this.activePage = 1;
    if (this.pages.get(status) === null) {
      this.fetchPage(status, 1);
    }
  }

  public onTabChange(index: number): void {
    this.selectStatus(STATUSES[index]);
  }

  public openMovie(movieId: string): void {
    this.router.navigate(['/', AppRoutes.MOVIE_DETAIL, movieId]);
  }

  public async moveTo(item: WatchlistItem, status: WatchlistStatus): Promise<void> {
    if (item.status === status) return;
    try {
      await firstValueFrom(this.api.updateStatus(item.movieId, { status }));
      this.toast.success(this.translate.instant('WATCHLIST.SAVED'));
      await this.fetchPage(item.status, this.pageNumberFor(item.status));
      await this.fetchPage(status, this.pageNumberFor(status));
    } catch {
      this.toast.error(this.translate.instant('WATCHLIST.UPDATE_FAILED'));
    }
  }

  public async remove(item: WatchlistItem): Promise<void> {
    try {
      await firstValueFrom(this.api.remove(item.movieId));
      this.toast.success(this.translate.instant('WATCHLIST.REMOVED'));
      await this.fetchPage(item.status, this.pageNumberFor(item.status));
    } catch {
      this.toast.error(this.translate.instant('WATCHLIST.UPDATE_FAILED'));
    }
  }

  public goToPage(page: number): void {
    this.activePage = page;
    this.fetchPage(this.activeStatus, page);
  }

  public otherStatuses(current: WatchlistStatus): WatchlistStatus[] {
    return STATUSES.filter((s) => s !== current);
  }

  public labelKey(status: WatchlistStatus): string {
    const snake = status.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
    return `WATCHLIST.${snake}`;
  }

  private fetchAll(): void {
    this.fetchPage(this.activeStatus, 1);
    STATUSES.filter((s) => s !== this.activeStatus).forEach((s) => this.fetchCountOnly(s));
  }

  private async fetchPage(status: WatchlistStatus, page: number): Promise<void> {
    this.loading.set(status, true);
    this.cdr.markForCheck();

    try {
      const result = await firstValueFrom(this.api.getMyWatchlist(status, page, PAGE_SIZE));
      this.pages.set(status, result);
      this.counts.set(status, result.totalCount);
    } catch {
      this.pages.set(status, { items: [], pageNumber: page, pageSize: PAGE_SIZE, totalCount: 0, totalPages: 0 });
    } finally {
      this.loading.set(status, false);
      this.cdr.markForCheck();
    }
  }

  private async fetchCountOnly(status: WatchlistStatus): Promise<void> {
    try {
      const result = await firstValueFrom(this.api.getMyWatchlist(status, 1, 1));
      this.counts.set(status, result.totalCount);
      this.cdr.markForCheck();
    } catch {
      return;
    }
  }

  private pageNumberFor(status: WatchlistStatus): number {
    return this.pages.get(status)?.pageNumber ?? 1;
  }
}
