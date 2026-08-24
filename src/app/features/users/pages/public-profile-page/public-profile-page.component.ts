import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { EMPTY, switchMap } from 'rxjs';
import { PublicProfile } from '../../../profile/models/profile.model';
import { ProfileApiService } from '../../../profile/services/profile-api.service';

@Component({
  selector: 'app-public-profile-page',
  templateUrl: './public-profile-page.component.html',
  styleUrl: './public-profile-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublicProfilePageComponent implements OnInit {
  public profile: PublicProfile | null = null;
  public loading = true;
  public notFound = false;

  public constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ProfileApiService,
    private readonly cdr: ChangeDetectorRef,
    private readonly destroyRef: DestroyRef,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(
        switchMap((params) => {
          const id = params.get('id');
          if (!id) {
            this.notFound = true;
            this.loading = false;
            this.cdr.markForCheck();
            return EMPTY;
          }
          return this.api.getPublicProfile(id);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (profile) => {
          this.profile = profile;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.notFound = true;
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }
}
