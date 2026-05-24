import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

interface AdminNavItem {
  labelKey: string;
  icon: string;
  link: string;
  adminOnly?: boolean;
}

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

  public readonly navItems: AdminNavItem[] = [
    { labelKey: 'ADMIN.NAV.DASHBOARD', icon: 'dashboard', link: '/admin/dashboard', adminOnly: true },
    { labelKey: 'ADMIN.NAV.MOVIES', icon: 'movie', link: '/admin/movies' },
    { labelKey: 'ADMIN.NAV.ARTISTS', icon: 'people', link: '/admin/artists' },
    { labelKey: 'ADMIN.NAV.USERS', icon: 'group', link: '/admin/users', adminOnly: true },
    { labelKey: 'ADMIN.NAV.ML_MODEL', icon: 'auto_awesome', link: '/admin/ml-model', adminOnly: true },
  ];

  public toggle(): void {
    this.collapsed = !this.collapsed;
  }
}
