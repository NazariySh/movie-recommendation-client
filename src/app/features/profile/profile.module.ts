import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { SharedModule } from '../../shared/shared.module';
import { PaginatorComponent } from '../../shared/components/paginator/paginator.component';

import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePageComponent } from './pages/profile-page/profile-page.component';
import { WatchlistPageComponent } from './pages/watchlist-page/watchlist-page.component';
import { GeneralInfoTabComponent } from './components/general-info-tab/general-info-tab.component';
import { ChangePasswordTabComponent } from './components/change-password-tab/change-password-tab.component';
import { StatisticsTabComponent } from './components/statistics-tab/statistics-tab.component';
import { SurveyTabComponent } from './components/survey-tab/survey-tab.component';
import { GenrePreferencesTabComponent } from './components/genre-preferences-tab/genre-preferences-tab.component';

@NgModule({
  declarations: [
    ProfilePageComponent,
    WatchlistPageComponent,
    GeneralInfoTabComponent,
    ChangePasswordTabComponent,
    StatisticsTabComponent,
    SurveyTabComponent,
    GenrePreferencesTabComponent,
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    NgxChartsModule,
    PaginatorComponent,
    ProfileRoutingModule,
  ],
})
export class ProfileModule {}
