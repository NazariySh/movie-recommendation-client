import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { SharedModule } from '../../shared/shared.module';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';

import { ArtistsRoutingModule } from './artists-routing.module';
import { ArtistListComponent } from './pages/artist-list/artist-list.component';
import { ArtistDetailComponent } from './pages/artist-detail/artist-detail.component';
import { ArtistCardComponent } from './components/artist-card/artist-card.component';

@NgModule({
  declarations: [ArtistListComponent, ArtistDetailComponent, ArtistCardComponent],
  imports: [
    SharedModule,
    MatFormFieldModule,
    MatInputModule,
    PaginatorComponent,
    ArtistsRoutingModule,
  ],
})
export class ArtistsModule {}
