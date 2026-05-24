import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AppIcon } from '../../core/constants/app-icons';
import { AppPaths, ProfileRoutes } from '../../core/constants/app-routes';
import { AuthService } from '../../core/services/auth.service';

interface MenuItem {
  label: string;
  icon: AppIcon;
  route: string;
  requiresAuth?: boolean;
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

  public mainMenuItems: MenuItem[] = [
    { label: 'NAV.DISCOVER', icon: AppIcon.Explore, route: AppPaths.DISCOVER },
    { label: 'NAV.WATCHLIST', icon: AppIcon.Bookmark, route: `${AppPaths.PROFILE}/${ProfileRoutes.WATCHLIST}`, requiresAuth: true },
    { label: 'NAV.ARTISTS', icon: AppIcon.Groups, route: AppPaths.ARTISTS },
  ];

  public bottomMenuItems: MenuItem[] = [
    { label: 'NAV.PROFILE', icon: AppIcon.HelpOutline, route: AppPaths.PROFILE, requiresAuth: true },
  ];

  public constructor(private readonly authService: AuthService) {
    this.isAuthenticated$ = this.authService.isAuthenticated$;
  }

  public toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}

