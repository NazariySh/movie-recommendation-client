import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedModule } from '../../shared/shared.module';
import { MovieCardComponent } from './components/movie-card/movie-card.component';
import { MovieSliderComponent } from './components/movie-slider/movie-slider.component';

@NgModule({
  declarations: [MovieCardComponent, MovieSliderComponent],
  imports: [SharedModule, MatCardModule, MatTooltipModule],
  exports: [MovieCardComponent, MovieSliderComponent],
})
export class MovieCommonModule {}
