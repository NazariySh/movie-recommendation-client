import { Injectable } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Injectable({ providedIn: 'root' })
export class ErrorMessageProvider {
  private readonly defaultMessages: Record<string, (err: Record<string, unknown>) => string> = {
    required: () => 'FORM.ERROR.REQUIRED',
    email: () => 'FORM.ERROR.EMAIL',
    minlength: () => 'FORM.ERROR.MIN_LENGTH',
    maxlength: () => 'FORM.ERROR.MAX_LENGTH',
    min: () => 'FORM.ERROR.MIN',
    max: () => 'FORM.ERROR.MAX',
    pattern: () => 'FORM.ERROR.PATTERN',
    passwordMismatch: () => 'AUTH.ERROR.PASSWORD_MISMATCH',
    strongPassword: () => 'AUTH.ERROR.WEAK_PASSWORD',
  };

  public getErrorMessage(errors: ValidationErrors | null | undefined): string | null {
    if (!errors) return null;

    const firstKey = Object.keys(errors)[0];
    if (!firstKey) return null;

    const errVal = errors[firstKey];

    if (errVal && typeof errVal === 'object' && typeof errVal.message === 'string') {
      return errVal.message;
    }

    const factory = this.defaultMessages[firstKey];
    if (factory) {
      return factory(errVal);
    }

    return 'FORM.ERROR.GENERIC';
  }
}
