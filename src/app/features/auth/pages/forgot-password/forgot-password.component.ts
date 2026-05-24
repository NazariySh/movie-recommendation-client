import { ChangeDetectionStrategy, Component, DestroyRef, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthPaths } from '../../../../core/constants/app-routes';
import { FormComponent } from '../../../../shared/form/form-component';
import { withMessage } from '../../../../shared/form/with-message';
import { wrapWithSpinner, globalSpinner$ } from '../../../../shared/utils/wrap-with-spinner';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ForgotPasswordComponent extends FormComponent implements OnInit {
  public readonly AuthPaths = AuthPaths;
  public readonly loading$ = globalSpinner$;

  public form!: FormGroup;
  public submitted = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
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
    });
  }

  public onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.form.disable();

    wrapWithSpinner(
      this.authService.forgotPassword(this.form.getRawValue()).pipe(
        catchError((err: HttpErrorResponse) => {
          this.handleValidationError(err);
          return EMPTY;
        }),
        finalize(() => {
          this.form.enable();
          if (this.form.valid) {
            this.submitted = true;
          }
          this.cdr.markForCheck();
        })
      )
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }
}
