import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { AppIcon } from '../../core/constants/app-icons';

interface MenuItem {
  label: string;
  icon: AppIcon;
  route: string;
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

  public mainMenuItems: MenuItem[] = [
    { label: 'NAV.DISCOVER', icon: AppIcon.Explore, route: '/movies' },
    { label: 'NAV.WATCHLIST', icon: AppIcon.Bookmark, route: '/profile/watchlist' },
    { label: 'NAV.ARTISTS', icon: AppIcon.Groups, route: '/artists' },
  ];

  public bottomMenuItems: MenuItem[] = [
    { label: 'NAV.PROFILE', icon: AppIcon.HelpOutline, route: '/profile' },
  ];

  public toggleSidebar(): void {
    this.isCollapsed = !this.isCollapsed;
  }
}

