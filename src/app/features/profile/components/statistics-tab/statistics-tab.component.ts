import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Color, LegendPosition, ScaleType } from '@swimlane/ngx-charts';
import { UserStats } from '../../models/profile.model';
import { ProfileApiService } from '../../services/profile-api.service';

interface ChartPoint {
  name: string;
  value: number;
}

const DISTRIBUTION_PALETTE = ['#2283dc'];
const GENRE_PALETTE = ['#ff8a65', '#ffb74d', '#ffd54f', '#aed581', '#4fc3f7', '#ba68c8'];

@Component({
  selector: 'app-statistics-tab',
  templateUrl: './statistics-tab.component.html',
  styleUrl: './statistics-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsTabComponent implements OnInit {
  public stats: UserStats | null = null;
  public loading = true;
  public errored = false;

  public readonly distributionLabels = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'];

  public distributionData: ChartPoint[] = [];
  public topGenresData: ChartPoint[] = [];

  public readonly legendPositionRight = LegendPosition.Right;

  public readonly distributionColors: Color = {
    name: 'rating-distribution',
    selectable: false,
    group: ScaleType.Ordinal,
    domain: DISTRIBUTION_PALETTE,
  };

  public readonly genreColors: Color = {
    name: 'top-genres',
    selectable: false,
    group: ScaleType.Ordinal,
    domain: GENRE_PALETTE,
  };

  public constructor(
    private readonly api: ProfileApiService,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.api.getMyStats()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (stats) => {
          this.stats = stats;
          this.distributionData = this.buildDistributionData(stats);
          this.topGenresData = this.buildGenresData(stats);
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.errored = true;
          this.cdr.markForCheck();
        },
      });
  }

  public get hoursWatched(): number {
    return Math.round((this.stats?.totalRuntimeMinutesWatched ?? 0) / 60);
  }

  public memberLevel(): { key: string; tier: 'bronze' | 'silver' | 'gold' } {
    const total = this.stats?.totalRatings ?? 0;
    if (total >= 200) return { key: 'PROFILE.TIER_GOLD', tier: 'gold' };
    if (total >= 50) return { key: 'PROFILE.TIER_SILVER', tier: 'silver' };
    return { key: 'PROFILE.TIER_BRONZE', tier: 'bronze' };
  }

  private buildDistributionData(stats: UserStats): ChartPoint[] {
    return this.distributionLabels.map((label, i) => ({
      name: label,
      value: stats.ratingDistribution[i] ?? 0,
    }));
  }

  private buildGenresData(stats: UserStats): ChartPoint[] {
    return stats.topGenres.map((g) => ({ name: g.name, value: g.count }));
  }
}
