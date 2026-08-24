import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { EMPTY, timer } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { FormComponent } from '../../../../shared/form/form-component';
import { passwordMatchValidator } from '../../../../shared/validators/password-match.validator';

@Component({
  selector: 'app-change-password-tab',
  templateUrl: './change-password-tab.component.html',
  styleUrl: './change-password-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordTabComponent extends FormComponent {
  public readonly form: FormGroup;
  public submitting = false;

  public constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly destroyRef: DestroyRef,
  ) {
    super();
    this.form = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatchValidator('newPassword', 'confirmPassword') },
    );
  }

  public onSubmit(): void {
    if (this.submitting || this.form.invalid) return;
    this.submitting = true;
    this.form.disable();
    this.cdr.markForCheck();

    const value = this.form.value;
    this.auth
      .changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      })
      .pipe(
        catchError((err: HttpErrorResponse) => {
          this.handleValidationError(err);
          if (err.status !== 400 && err.status !== 422) {
            this.toast.error(this.translate.instant('PROFILE.PASSWORD_CHANGE_FAILED'));
          }
          return EMPTY;
        }),
        finalize(() => {
          this.submitting = false;
          this.form.enable();
          this.cdr.markForCheck();
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => {
        this.toast.success(this.translate.instant('PROFILE.PASSWORD_CHANGED'));
        this.form.reset();
        timer(1500)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => this.auth.logout().subscribe());
      });
  }
}
