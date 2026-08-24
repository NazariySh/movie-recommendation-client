import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { AppPaths, AuthPaths } from '../../../../core/constants/app-routes';
import { FormComponent } from '../../../../shared/form/form-component';
import { withMessage } from '../../../../shared/form/with-message';
import { wrapWithSpinner, globalSpinner$ } from '../../../../shared/utils/wrap-with-spinner';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends FormComponent implements OnInit {
  public readonly AuthPaths = AuthPaths;
  public readonly AppPaths = AppPaths;
  public readonly loading$ = globalSpinner$;

  public form!: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly destroyRef: DestroyRef
  ) {
    super();
  }

  public ngOnInit(): void {
    this.form = this.fb.group({
      email: [
        '',
        [
          withMessage(Validators.required, 'AUTH.ERROR.REQUIRED'),
          withMessage(Validators.email, 'AUTH.ERROR.EMAIL_INVALID'),
        ],
      ],
      password: ['', [withMessage(Validators.required, 'AUTH.ERROR.REQUIRED')]],
      rememberMe: [true],
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.form.disable();

    wrapWithSpinner(
      this.authService.login(this.form.getRawValue()).pipe(
        catchError((err: HttpErrorResponse) => {
          this.handleValidationError(err);
          return EMPTY;
        }),
        finalize(() => this.form.enable())
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

  public onGoogleLogin(idToken: string): void {
    wrapWithSpinner(
      this.authService.loginWithGoogle(idToken).pipe(
        catchError((err: HttpErrorResponse) => {
          this.handleValidationError(err);
          return EMPTY;
        }),
      ),
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
