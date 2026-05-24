import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AppPaths } from '../../../../core/constants/app-routes';
import { SurveyResponse } from '../../models/survey.model';
import { SurveyApiService } from '../../services/survey-api.service';

@Component({
  selector: 'app-survey-tab',
  templateUrl: './survey-tab.component.html',
  styleUrl: './survey-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyTabComponent implements OnInit {
  public response: SurveyResponse | null = null;
  public loading = true;

  public readonly onboardingPath = AppPaths.ONBOARDING;

  public constructor(
    private readonly api: SurveyApiService,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef,
  ) {}

  public ngOnInit(): void {
    this.api.getMyLatest()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.response = response;
          this.loading = false;
          this.cdr.markForCheck();
        },
        error: () => {
          this.loading = false;
          this.cdr.markForCheck();
        },
      });
  }

  public takeSurvey(): void {
    this.router.navigateByUrl(this.onboardingPath);
  }
}
