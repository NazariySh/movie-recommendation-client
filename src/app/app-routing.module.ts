import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { ServerErrorComponent } from './shared/components/server-error/server-error.component';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';


const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadChildren: () => import('./features/discover/discover.module').then(m => m.DiscoverModule),
  },
  {
    path: 'auth',
    loadChildren: () => import('./features/auth/auth.module').then(m => m.AuthModule),
  },
  {
    path: 'movies',
    loadChildren: () => import('./features/movies/movies.module').then(m => m.MoviesModule),
  },
  {
    path: 'search',
    loadChildren: () => import('./features/search/search.module').then(m => m.SearchModule),
  },
  {
    path: 'artists',
    loadChildren: () => import('./features/artists/artists.module').then(m => m.ArtistsModule),
  },
  {
    path: 'profile',
    loadChildren: () => import('./features/profile/profile.module').then(m => m.ProfileModule),
    canActivate: [authGuard],
  },
  {
    path: 'users',
    loadChildren: () => import('./features/users/users.module').then(m => m.UsersModule),
  },
  {
    path: 'onboarding',
    loadChildren: () => import('./features/onboarding/onboarding.module').then(m => m.OnboardingModule),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Admin', 'Moderator'] },
  },
  {
    path: 'rules',
    loadChildren: () => import('./features/rules/rules.module').then(m => m.RulesModule),
  },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'error', component: ServerErrorComponent },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
