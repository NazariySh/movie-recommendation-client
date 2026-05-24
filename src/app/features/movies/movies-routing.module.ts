import { NgModule, inject } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterModule, Routes, UrlTree } from '@angular/router';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { FiltersComponent } from './pages/filters/filters.component';
import { GenresListComponent } from './pages/genres-list/genres-list.component';
import { MovieDetailComponent } from './pages/movie-detail/movie-detail.component';

const redirectToCatalogBySlug = (route: ActivatedRouteSnapshot): UrlTree => {
  const router = inject(Router);
  const slug = route.paramMap.get('slug');
  return router.createUrlTree(['/movies'], { queryParams: { genres: slug } });
};

const routes: Routes = [
  { path: '', component: CatalogComponent },
  { path: 'filters', component: FiltersComponent },
  { path: 'genres', component: GenresListComponent },
  { path: 'genres/:slug', canActivate: [redirectToCatalogBySlug], children: [] },
  {
    path: ':id',
    component: MovieDetailComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MoviesRoutingModule {}
