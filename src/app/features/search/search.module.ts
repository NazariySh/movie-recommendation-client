import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '../../shared/shared.module';
import { MovieCommonModule } from '../movies/movie-common.module';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';

import { SearchRoutingModule } from './search-routing.module';
import { SearchPageComponent } from './pages/search-page/search-page.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';

@NgModule({
  declarations: [SearchPageComponent],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatIconModule,
    MovieCommonModule,
    SearchBarComponent,
    PaginatorComponent,
    SearchRoutingModule,
  ],
})
export class SearchModule {}
