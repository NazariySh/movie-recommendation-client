import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SharedModule } from '../../shared/shared.module';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { ReviewFormComponent } from './components/review-form/review-form.component';
import { ReviewCardComponent } from './components/review-card/review-card.component';

@NgModule({
  declarations: [
    ReviewsComponent,
    ReviewFormComponent,
    ReviewCardComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatSlideToggleModule,
    MatSliderModule,
    MatProgressSpinnerModule,
  ],
  exports: [
    ReviewsComponent,
  ],
})
export class MovieReviewsModule {}
