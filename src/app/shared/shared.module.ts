import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { RuntimePipe } from './pipes/runtime.pipe';
import { LocalizedDatePipe } from './pipes/localized-date.pipe';

import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';
import { ImageWithFallbackComponent } from './components/image-with-fallback/image-with-fallback.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ChipComponent } from './components/chip/chip.component';
import { PosterCardComponent } from './components/poster-card/poster-card.component';
import { RatingStarsComponent } from './components/rating-stars/rating-stars.component';
import { PasswordStrengthMeterComponent } from './components/password-strength-meter/password-strength-meter.component';
import { LanguageSwitcherComponent } from './components/language-switcher/language-switcher.component';

import { SpinnerModule } from './components/spinner/spinner.module';
import { ButtonModule } from './components/button/button.module';
import { FormFieldsModule } from './components/form-fields/form-fields.module';
import { SelectModule } from './components/select/select.module';

const PIPES = [RuntimePipe, LocalizedDatePipe];
const STANDALONE_COMPONENTS = [
  SkeletonLoaderComponent,
  EmptyStateComponent,
  ImageWithFallbackComponent,
  AvatarComponent,
  ChipComponent,
  PosterCardComponent,
  RatingStarsComponent,
  PasswordStrengthMeterComponent,
  LanguageSwitcherComponent,
];

@NgModule({
  declarations: [...PIPES],
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    SpinnerModule,
    ButtonModule,
    FormFieldsModule,
    SelectModule,
    ...STANDALONE_COMPONENTS,
  ],
  exports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    TranslateModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatSnackBarModule,
    ...PIPES,
    ...STANDALONE_COMPONENTS,
    SpinnerModule,
    ButtonModule,
    FormFieldsModule,
    SelectModule,
  ],
})
export class SharedModule {}
