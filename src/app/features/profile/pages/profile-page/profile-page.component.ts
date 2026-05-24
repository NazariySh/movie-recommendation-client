import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { AuthService } from '../../../../core/services/auth.service';
import { UserProfile } from '../../models/profile.model';
import { ProfileApiService } from '../../services/profile-api.service';

@Component({
  selector: 'app-profile-page',
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfilePageComponent implements OnInit {
  public profile: UserProfile | null = null;
  public loading = true;

  public constructor(
    private readonly api: ProfileApiService,
    private readonly authService: AuthService,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.api.getMyProfile()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  public onProfileUpdated(profile: UserProfile): void {
    this.profile = profile;
    this.authService.patchCurrentUser({
      username: profile.username,
      avatarUrl: profile.avatarUrl,
      bio: profile.bio,
      preferredLanguage: profile.preferredLanguage,
    });
    this.cdr.markForCheck();
  }
}
