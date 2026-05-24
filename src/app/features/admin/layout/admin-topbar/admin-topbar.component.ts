import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { LanguageService } from '../../../../core/services/language.service';
import { User } from '../../../../core/models/user.model';
import { AppPaths } from '../../../../core/constants/app-routes';
import { AvatarComponent } from '../../../../shared/components/avatar/avatar.component';

@Component({
  selector: 'app-admin-topbar',
  templateUrl: './admin-topbar.component.html',
  styleUrl: './admin-topbar.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatMenuModule,
    MatButtonModule,
    MatTooltipModule,
    TranslateModule,
    AvatarComponent,
  ],
})
export class AdminTopbarComponent {
  public readonly user$: Observable<User | null>;

  public readonly homeLink = AppPaths.DISCOVER;
  public readonly profileLink = AppPaths.PROFILE;

  public readonly languages = [
    { code: 'uk', labelKey: 'LANGUAGE.UK' },
    { code: 'en', labelKey: 'LANGUAGE.EN' },
  ];

  public constructor(
    private readonly authService: AuthService,
    private readonly languageService: LanguageService,
  ) {
    this.user$ = this.authService.user$;
  }

  public get currentLang(): string {
    return this.languageService.current;
  }

  public setLanguage(code: string): void {
    this.languageService.setLanguage(code);
  }

  public logout(): void {
    this.authService.logout().subscribe();
  }
}
