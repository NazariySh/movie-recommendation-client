import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { roleGuard } from '../../core/guards/role.guard';
import { AdminShellComponent } from './layout/admin-shell/admin-shell.component';
import { AdminDashboardComponent } from './pages/admin-dashboard/admin-dashboard.component';
import { AdminMoviesListComponent } from './pages/admin-movies-list/admin-movies-list.component';
import { AdminMovieFormComponent } from './pages/admin-movie-form/admin-movie-form.component';
import { AdminArtistsListComponent } from './pages/admin-artists-list/admin-artists-list.component';
import { AdminArtistFormComponent } from './pages/admin-artist-form/admin-artist-form.component';
import { AdminUsersListComponent } from './pages/admin-users-list/admin-users-list.component';
import { AdminUserDetailComponent } from './pages/admin-user-detail/admin-user-detail.component';
import { AdminMlModelComponent } from './pages/admin-ml-model/admin-ml-model.component';

const routes: Routes = [
  {
    path: '',
    component: AdminShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: AdminDashboardComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
      { path: 'movies', component: AdminMoviesListComponent },
      { path: 'movies/new', component: AdminMovieFormComponent },
      { path: 'movies/:id/edit', component: AdminMovieFormComponent },
      { path: 'artists', component: AdminArtistsListComponent },
      { path: 'artists/new', component: AdminArtistFormComponent },
      { path: 'artists/:id/edit', component: AdminArtistFormComponent },
      { path: 'users', component: AdminUsersListComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
      { path: 'users/:id', component: AdminUserDetailComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
      { path: 'ml-model', component: AdminMlModelComponent, canActivate: [roleGuard], data: { roles: ['Admin'] } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
