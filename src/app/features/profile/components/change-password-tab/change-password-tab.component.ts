import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

const passwordMatch: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const newPassword = group.get('newPassword')?.value;
  const confirm = group.get('confirmPassword')?.value;
  return newPassword && confirm && newPassword !== confirm ? { passwordMismatch: true } : null;
};

@Component({
  selector: 'app-change-password-tab',
  templateUrl: './change-password-tab.component.html',
  styleUrl: './change-password-tab.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChangePasswordTabComponent {
  public readonly form: FormGroup;
  public submitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly auth: AuthService,
    private readonly toast: ToastService,
    private readonly translate: TranslateService,
    private readonly cdr: ChangeDetectorRef,
  ) {
    this.form = this.fb.group(
      {
        currentPassword: ['', [Validators.required]],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: passwordMatch },
    );
  }

  public get newPasswordValue(): string {
    return this.form.controls['newPassword'].value ?? '';
  }

  public onSubmit(): void {
    if (this.form.invalid) return;
    this.submitting = true;

    const value = this.form.value;
    this.auth
      .changePassword({
        currentPassword: value.currentPassword,
        newPassword: value.newPassword,
      })
      .subscribe({
        next: () => {
          this.submitting = false;
          this.cdr.markForCheck();
          this.form.reset();
          this.toast.success(this.translate.instant('PROFILE.PASSWORD_CHANGED'));
        },
        error: () => {
          this.submitting = false;
          this.cdr.markForCheck();
          this.toast.error(this.translate.instant('PROFILE.PASSWORD_CHANGE_FAILED'));
        },
      });
  }
}
