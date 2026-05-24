import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { AppPaths } from '../../../../core/constants/app-routes';

@Component({
  selector: 'app-cold-start-cta',
  templateUrl: './cold-start-cta.component.html',
  styleUrl: './cold-start-cta.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColdStartCtaComponent {
  public readonly onboardingPath = AppPaths.ONBOARDING;

  constructor(private readonly router: Router) {}

  public takeSurvey(): void {
    this.router.navigateByUrl(this.onboardingPath);
  }
}
