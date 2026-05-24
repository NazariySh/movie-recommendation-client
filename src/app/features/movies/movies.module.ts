import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSliderModule } from '@angular/material/slider';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SharedModule } from '../../shared/shared.module';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';

import { MoviesRoutingModule } from './movies-routing.module';
import { MovieReviewsModule } from '../movieReviews/movie-reviews.module';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { FiltersComponent } from './pages/filters/filters.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';
import { GenresListComponent } from './pages/genres-list/genres-list.component';
import { TrailerDialogComponent } from './components/trailer-dialog/trailer-dialog.component';
import { MovieCommonModule } from './movie-common.module';

@NgModule({
  declarations: [
    CatalogComponent,
    FiltersComponent,
    MovieDetailComponent,
    GenresListComponent,
    TrailerDialogComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatSliderModule,
    MatDialogModule,
    MatTooltipModule,
    PaginatorComponent,
    MovieReviewsModule,
    MovieCommonModule,
    MoviesRoutingModule,
  ],
  exports: [MovieCommonModule],
})
export class MoviesModule {}
