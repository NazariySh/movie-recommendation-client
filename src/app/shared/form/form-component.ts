import { ChangeDetectorRef, Directive, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../core/services/toast.service';
import { parseServerErrors } from './server-errors';

@Directive()
export abstract class FormComponent {
  protected readonly toast = inject(ToastService);
  protected readonly translate = inject(TranslateService);
  protected readonly cdr = inject(ChangeDetectorRef);

  public abstract form: FormGroup;

  protected handleValidationError(err: HttpErrorResponse): void {
    if (err.status !== 400 && err.status !== 422) return;

    const parsed = parseServerErrors(err, Object.keys(this.form.controls));

    for (const [field, message] of Object.entries(parsed.fieldErrors)) {
      const control = this.form.get(field);
      if (!control) continue;

      control.setErrors({
        ...(control.errors ?? {}),
        serverError: { message },
      });
      control.markAsTouched();
    }

    if (parsed.general) {
      this.toast.error(this.translate.instant(parsed.general));
    }

    this.cdr.markForCheck();
  }
}
