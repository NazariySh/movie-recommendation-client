import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, timer } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthPaths } from '../../../../core/constants/app-routes';
import { FormComponent } from '../../../../shared/form/form-component';
import { withMessage } from '../../../../shared/form/with-message';
import { confirmsPasswordValidator } from '../../../../shared/validators/password-match.validator';
import { strongPasswordValidator } from '../../../../shared/validators/strong-password.validator';
import { wrapWithSpinner, globalSpinner$ } from '../../../../shared/utils/wrap-with-spinner';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResetPasswordComponent extends FormComponent implements OnInit {
  public readonly AuthPaths = AuthPaths;
  public readonly loading$ = globalSpinner$;

  public form!: FormGroup;
  public success = false;
  public tokenInvalid = false;

  private userId = '';
  private token = '';

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef
  ) {
    super();
  }

  public ngOnInit(): void {
    this.userId = this.route.snapshot.queryParams['userId'] ?? '';
    this.token = this.route.snapshot.queryParams['token'] ?? '';
    if (!this.userId || !this.token) {
      this.tokenInvalid = true;
      return;
    }

    this.form = this.fb.group({
      newPassword: [
        '',
        [
          withMessage(Validators.required, 'AUTH.ERROR.REQUIRED'),
          withMessage(strongPasswordValidator, 'AUTH.ERROR.WEAK_PASSWORD'),
        ],
      ],
      confirmPassword: [
        '',
        [withMessage(Validators.required, 'AUTH.ERROR.REQUIRED'), confirmsPasswordValidator('newPassword')],
      ],
    });

    this.form.get('newPassword')!.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.form.get('confirmPassword')!.updateValueAndValidity({ emitEvent: false }));
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.form.disable();

    wrapWithSpinner(
      this.authService
        .resetPassword({
          userId: this.userId,
          token: this.token,
          newPassword: this.form.getRawValue().newPassword,
        })
        .pipe(
          catchError((err: HttpErrorResponse) => {
            this.handleResetError(err);
            return EMPTY;
          }),
          finalize(() => this.form.enable())
        )
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.success = true;
        this.cdr.markForCheck();
        timer(2500)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.router.navigate([AuthPaths.LOGIN]));
      });
  }

  private handleResetError(err: HttpErrorResponse): void {
    this.handleValidationError(err);

    const hasFieldError =
      !!this.form.get('newPassword')?.errors?.['serverError'] ||
      !!this.form.get('confirmPassword')?.errors?.['serverError'];
    if ((err.status === 400 || err.status === 422) && !hasFieldError) {
      this.toast.error(this.translate.instant('AUTH.ERROR.RESET_FAILED'));
    }
  }
}
