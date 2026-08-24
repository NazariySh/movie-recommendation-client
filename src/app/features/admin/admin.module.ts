import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { SharedModule } from '../../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminUsersListComponent } from './pages/admin-users-list/admin-users-list.component';
import { AdminUserDetailComponent } from './pages/admin-user-detail/admin-user-detail.component';
import { AdminMoviesListComponent } from './pages/admin-movies-list/admin-movies-list.component';
import { AdminMovieFormComponent } from './pages/admin-movie-form/admin-movie-form.component';
import { AdminArtistsListComponent } from './pages/admin-artists-list/admin-artists-list.component';
import { AdminArtistFormComponent } from './pages/admin-artist-form/admin-artist-form.component';
import { AdminMlModelComponent } from './pages/admin-ml-model/admin-ml-model.component';
import { ImageUploadComponent } from './components/image-upload/image-upload.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    AdminUsersListComponent,
    AdminUserDetailComponent,
    AdminMoviesListComponent,
    AdminMovieFormComponent,
    AdminArtistsListComponent,
    AdminArtistFormComponent,
    AdminMlModelComponent,
    ImageUploadComponent,
  ],
  imports: [
    SharedModule,
    FormsModule,
    MatMenuModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    AdminRoutingModule,
  ],
})
export class AdminModule {}
