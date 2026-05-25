import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, combineLatest, map } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { AdminPaths } from '../../../../core/constants/app-routes';
import { SidebarStateService } from '../../../../core/services/sidebar-state.service';

interface AdminNavItem {
  labelKey: string;
  icon: string;
  link: string;
  adminOnly?: boolean;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { labelKey: 'ADMIN.NAV.DASHBOARD', icon: 'dashboard', link: AdminPaths.DASHBOARD, adminOnly: true },
  { labelKey: 'ADMIN.NAV.MOVIES', icon: 'movie', link: AdminPaths.MOVIES },
  { labelKey: 'ADMIN.NAV.ARTISTS', icon: 'people', link: AdminPaths.ARTISTS },
  { labelKey: 'ADMIN.NAV.USERS', icon: 'group', link: AdminPaths.USERS, adminOnly: true },
  { labelKey: 'ADMIN.NAV.ML_MODEL', icon: 'auto_awesome', link: AdminPaths.ML_MODEL, adminOnly: true },
];

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrl: './admin-sidebar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, MatIconModule, MatTooltipModule, TranslateModule],
})
export class AdminSidebarComponent {
  public collapsed = false;

  public readonly dashboardLink = AdminPaths.DASHBOARD;
  public readonly visibleNavItems$: Observable<AdminNavItem[]>;
  public readonly drawerOpen$: Observable<boolean>;

  public constructor(
    private readonly authService: AuthService,
    private readonly sidebarState: SidebarStateService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
  ) {
    this.visibleNavItems$ = combineLatest([
      this.authService.hasRole$('Admin'),
    ]).pipe(
      map(([isAdmin]) => ADMIN_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)),
    );
    this.drawerOpen$ = this.sidebarState.drawerOpen$;

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.sidebarState.close());
  }

  public toggle(): void {
    this.collapsed = !this.collapsed;
  }

  public closeDrawer(): void {
    this.sidebarState.close();
  }
}
