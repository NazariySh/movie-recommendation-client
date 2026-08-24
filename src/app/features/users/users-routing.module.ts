import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PublicProfilePageComponent } from './pages/public-profile-page/public-profile-page.component';

const routes: Routes = [
  { path: ':id', component: PublicProfilePageComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UsersRoutingModule {}
