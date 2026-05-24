import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs';
import { PublicProfile } from '../../models/profile.model';
import { ProfileApiService } from '../../services/profile-api.service';

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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly api: ProfileApiService,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap((params) => this.api.getPublicProfile(params.get('id') ?? '')))
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
