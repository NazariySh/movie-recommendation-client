import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '../../shared/shared.module';

import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { VerifyEmailComponent } from './pages/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './pages/reset-password/reset-password.component';
import { AuthFormWrapperComponent } from './components/auth-form-wrapper/auth-form-wrapper.component';
import { PasswordStrengthMeterComponent } from './components/password-strength-meter/password-strength-meter.component';
import { SocialAuthButtonsComponent } from './components/social-auth-buttons/social-auth-buttons.component';

@NgModule({
  declarations: [
    LoginComponent,
    RegisterComponent,
    VerifyEmailComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
    AuthFormWrapperComponent,
    SocialAuthButtonsComponent,
  ],
  imports: [SharedModule, ReactiveFormsModule, PasswordStrengthMeterComponent, AuthRoutingModule],
})
export class AuthModule {}
