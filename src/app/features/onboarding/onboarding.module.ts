import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '../../shared/shared.module';
import { OnboardingRoutingModule } from './onboarding-routing.module';
import { OnboardingPageComponent } from './pages/onboarding-page/onboarding-page.component';

@NgModule({
  declarations: [OnboardingPageComponent],
  imports: [SharedModule, MatButtonModule, MatIconModule, OnboardingRoutingModule],
})
export class OnboardingModule {}
