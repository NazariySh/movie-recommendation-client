import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

import { SharedModule } from '../../shared/shared.module';
import { MovieCommonModule } from '../movies/movie-common.module';

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
    SearchRoutingModule,
  ],
})
export class SearchModule {}
