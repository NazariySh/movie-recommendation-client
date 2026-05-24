import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, combineLatest, map } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { AdminPaths } from '../../../../core/constants/app-routes';

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

  public constructor(private readonly authService: AuthService) {
    this.visibleNavItems$ = combineLatest([
      this.authService.hasRole$('Admin'),
    ]).pipe(
      map(([isAdmin]) => ADMIN_NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin)),
    );
  }

  public toggle(): void {
    this.collapsed = !this.collapsed;
  }
}
