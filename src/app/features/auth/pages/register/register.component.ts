import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, interval } from 'rxjs';
import { catchError, finalize, take } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { LanguageService } from '../../../../core/services/language.service';
import { AppPaths, AuthPaths } from '../../../../core/constants/app-routes';
import { FormComponent } from '../../../../shared/form/form-component';
import { withMessage } from '../../../../shared/form/with-message';
import { confirmsPasswordValidator } from '../../../../shared/validators/password-match.validator';
import { strongPasswordValidator } from '../../../../shared/validators/strong-password.validator';
import { wrapWithSpinner, globalSpinner$ } from '../../../../shared/utils/wrap-with-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegisterComponent extends FormComponent implements OnInit {
  public readonly AuthPaths = AuthPaths;
  public readonly AppPaths = AppPaths;
  public readonly loading$ = globalSpinner$;

  public form!: FormGroup;
  public registered = false;
  public registeredEmail = '';
  public resendCooldown = 0;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly languageService: LanguageService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly destroyRef: DestroyRef
  ) {
    super();
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      username: [
        '',
        [
          withMessage(Validators.required, 'AUTH.ERROR.REQUIRED'),
          withMessage(Validators.minLength(3), 'AUTH.ERROR.USERNAME_MIN'),
          withMessage(Validators.maxLength(30), 'FORM.ERROR.MAX_LENGTH'),
          withMessage(Validators.pattern(/^[a-zA-Z0-9_]+$/), 'AUTH.ERROR.USERNAME_PATTERN'),
        ],
      ],
      email: [
        '',
        [
          withMessage(Validators.required, 'AUTH.ERROR.REQUIRED'),
          withMessage(Validators.email, 'AUTH.ERROR.EMAIL_INVALID'),
        ],
      ],
      password: [
        '',
        [
          withMessage(Validators.required, 'AUTH.ERROR.REQUIRED'),
          withMessage(strongPasswordValidator, 'AUTH.ERROR.WEAK_PASSWORD'),
        ],
      ],
      confirmPassword: [
        '',
        [withMessage(Validators.required, 'AUTH.ERROR.REQUIRED'), confirmsPasswordValidator('password')],
      ],
      agreeToTerms: [false, [Validators.requiredTrue]],
    });

    this.form.get('password')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.form.get('confirmPassword')!.updateValueAndValidity({ emitEvent: false }));
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.form.disable();

    const { username, email, password } = this.form.getRawValue();
    const preferredLanguage = this.languageService.current;

    wrapWithSpinner(
      this.authService.register({ username, email, password, preferredLanguage }).pipe(
        catchError((err: HttpErrorResponse) => {
          this.handleValidationError(err);
          return EMPTY;
        }),
        finalize(() => this.form.enable())
      )
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.registered = true;
        this.registeredEmail = email;
        this.startResendCooldown(60);
        this.cdr.markForCheck();
      });
  }

  public resendVerification(): void {
    if (this.resendCooldown > 0 || !this.registeredEmail) return;

    wrapWithSpinner(this.authService.resendVerification({ email: this.registeredEmail }))
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.startResendCooldown(60));
  }

  private startResendCooldown(seconds: number): void {
    this.resendCooldown = seconds;
    this.cdr.markForCheck();

    interval(1000)
      .pipe(take(seconds), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resendCooldown--;
        this.cdr.markForCheck();
      });
  }

  public goToLogin(): void {
    this.router.navigate([AuthPaths.LOGIN]);
  }

  public onGoogleLogin(idToken: string): void {
    wrapWithSpinner(
      this.authService.loginWithGoogle(idToken).pipe(
        catchError((err: HttpErrorResponse) => {
          this.handleValidationError(err);
          return EMPTY;
        })
      )
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] ?? AppPaths.ROOT;
        if (!user.onboardingCompleted) {
          this.router.navigate([AppPaths.ONBOARDING]);
        } else {
          this.router.navigateByUrl(returnUrl);
        }
      });
  }
}
