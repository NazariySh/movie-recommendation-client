import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(passwordField: string, confirmField: string): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const password = group.get(passwordField)?.value;
    const confirm = group.get(confirmField)?.value;
    if (!password || !confirm) return null;
    return password === confirm ? null : { passwordMismatch: true };
  };
}

export function confirmsPasswordValidator(passwordField: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;

    const password = parent.get(passwordField)?.value;
    const confirm = control.value;
    if (!password || !confirm) return null;

    return password === confirm
      ? null
      : { passwordMismatch: { message: 'AUTH.ERROR.PASSWORD_MISMATCH' } };
  };
}
