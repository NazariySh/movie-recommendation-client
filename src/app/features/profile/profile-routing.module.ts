import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { PublicProfilePageComponent } from './pages/public-profile-page/public-profile-page.component';
import { WatchlistPageComponent } from './pages/watchlist-page/watchlist-page.component';

const routes: Routes = [
  { path: '', component: ProfilePageComponent },
  { path: 'watchlist', component: WatchlistPageComponent },
  { path: 'public/:id', component: PublicProfilePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
