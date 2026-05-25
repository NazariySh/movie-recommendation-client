import { Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Observable, map } from 'rxjs';
import { filter } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AppIcon } from '../../core/constants/app-icons';
import { AppPaths, ProfileRoutes } from '../../core/constants/app-routes';
import { AuthService } from '../../core/services/auth.service';
import { SidebarStateService } from '../../core/services/sidebar-state.service';

interface MenuItem {
  label: string;
  icon: AppIcon;
  route: string;
  requiresAuth?: boolean;
  exact?: boolean;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule, TranslateModule],
})
export class SidebarComponent {
  public readonly AppIcon = AppIcon;

  public isCollapsed = false;
  public readonly isAuthenticated$: Observable<boolean>;
  public readonly showOnboarding$: Observable<boolean>;
  public readonly drawerOpen$: Observable<boolean>;

  public readonly onboardingMenuItem: MenuItem = {
    label: 'NAV.ONBOARDING',
    icon: AppIcon.Tune,
    route: AppPaths.ONBOARDING,
  };

  public mainMenuItems: MenuItem[] = [
    { label: 'NAV.DISCOVER', icon: AppIcon.Explore, route: AppPaths.DISCOVER, exact: true },
    { label: 'NAV.WATCHLIST', icon: AppIcon.Bookmark, route: `${AppPaths.PROFILE}/${ProfileRoutes.WATCHLIST}`, requiresAuth: true },
    { label: 'NAV.ARTISTS', icon: AppIcon.Groups, route: AppPaths.ARTISTS },
  ];

  public bottomMenuItems: MenuItem[] = [
    { label: 'NAV.PROFILE', icon: AppIcon.HelpOutline, route: AppPaths.PROFILE, requiresAuth: true, exact: true },
  ];

  public constructor(
    private readonly authService: AuthService,
    private readonly sidebarState: SidebarStateService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
  ) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
    this.showOnboarding$ = this.authService.user$.pipe(
      map((user) => !!user && !user.onboardingCompleted),
    );
    this.drawerOpen$ = this.sidebarState.drawerOpen$;

    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.sidebarState.close());
  }

  public toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public closeDrawer(): void {
    this.sidebarState.close();
  }
}
