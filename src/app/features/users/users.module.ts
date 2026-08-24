import { NgModule } from '@angular/core';

import { SharedModule } from '../../shared/shared.module';

import { UsersRoutingModule } from './users-routing.module';
import { PublicProfilePageComponent } from './pages/public-profile-page/public-profile-page.component';

@NgModule({
  declarations: [PublicProfilePageComponent],
  imports: [SharedModule, UsersRoutingModule],
})
export class UsersModule {}
