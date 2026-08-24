import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { interval } from 'rxjs';
import { startWith } from 'rxjs/operators';
import { AdminDashboardService } from '../../services/admin-dashboard.service';
import { DashboardActivity, DashboardSummary } from '../../models/admin-models';
import { ADMIN_DASHBOARD_ACTIVITY_DAYS, ADMIN_DASHBOARD_REFRESH_MS } from '../../admin.constants';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminDashboardComponent implements OnInit {
  public summary: DashboardSummary | null = null;
  public activity: DashboardActivity | null = null;
  public loading = true;
  public maxActivity = 0;

  public constructor(
    private readonly dashboardApi: AdminDashboardService,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    interval(ADMIN_DASHBOARD_REFRESH_MS)
      .pipe(startWith(0), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.refresh());
  }

  public refresh(): void {
    this.dashboardApi.getSummary()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(s => {
        this.summary = s;
        this.loading = false;
        this.cdr.markForCheck();
      });
    this.dashboardApi.getActivity(ADMIN_DASHBOARD_ACTIVITY_DAYS)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(a => {
        this.activity = a;
        this.maxActivity = Math.max(1, ...a.points.flatMap(p => [p.newUsers, p.ratings, p.reviews]));
        this.cdr.markForCheck();
      });
  }

  public barHeight(value: number): number {
    return this.maxActivity > 0 ? Math.round((value / this.maxActivity) * 100) : 0;
  }
}
