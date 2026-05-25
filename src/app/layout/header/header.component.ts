import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AppRoutes } from '../../core/constants/app-routes';
import { FilterService } from '../../core/services/filter.service';
import { AuthService } from '../../core/services/auth.service';
import { SidebarStateService } from '../../core/services/sidebar-state.service';
import { User } from '../../core/models/user.model';
import { SearchBarComponent } from '../../features/search/components/search-bar/search-bar.component';
import { LanguageSwitcherComponent } from '../../shared/components/language-switcher/language-switcher.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    SearchBarComponent,
    LanguageSwitcherComponent,
  ],
})
export class HeaderComponent {
  private readonly filterService = inject(FilterService);
  private readonly authService = inject(AuthService);
  private readonly sidebarState = inject(SidebarStateService);

  public readonly AppRoutes = AppRoutes;

  public readonly navItems = [
    { labelKey: 'NAV.ALL', route: '/movies' },
    { labelKey: 'NAV.MOVIES', route: '/movies', queryParams: { type: 'movie' } },
    { labelKey: 'NAV.SERIES', route: '/movies', queryParams: { type: 'series' } },
    { labelKey: 'NAV.GENRES', route: '/movies/genres' },
  ];

  public readonly user$: Observable<User | null> = this.authService.user$;
  public readonly isAuthenticated$: Observable<boolean> = this.authService.isAuthenticated$;

  public get hasActiveFilters(): boolean {
    return this.filterService.isActive();
  }

  public openDrawer(): void {
    this.sidebarState.open();
  }

  public logout(): void {
    this.authService.logout().subscribe();
  }
}
