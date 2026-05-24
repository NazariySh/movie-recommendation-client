import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '../../shared/shared.module';
import { MovieCommonModule } from '../movies/movie-common.module';

import { DiscoverRoutingModule } from './discover-routing.module';
import { DiscoverPageComponent } from './pages/discover-page/discover-page.component';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { SectionSkeletonComponent } from './components/section-skeleton/section-skeleton.component';
import { ColdStartCtaComponent } from './components/cold-start-cta/cold-start-cta.component';

@NgModule({
  declarations: [
    DiscoverPageComponent,
    HeroSectionComponent,
    SectionSkeletonComponent,
    ColdStartCtaComponent,
  ],
  imports: [
    SharedModule,
    MovieCommonModule,
    MatButtonModule,
    MatIconModule,
    DiscoverRoutingModule,
  ],
})
export class DiscoverModule {}
