import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { WatchlistPageComponent } from './pages/watchlist-page/watchlist-page.component';

const routes: Routes = [
  { path: '', component: ProfilePageComponent },
  { path: 'watchlist', component: WatchlistPageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
