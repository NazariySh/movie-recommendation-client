import { AbstractControl, ValidationErrors } from '@angular/forms';

export function strongPasswordValidator(control: AbstractControl): ValidationErrors | null {
  const value: string = control.value ?? '';
  if (!value) return null;

  const hasUpperCase = /[A-Z]/.test(value);
  const hasLowerCase = /[a-z]/.test(value);
  const hasDigit = /\d/.test(value);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
  const hasMinLength = value.length >= 8;

  if (hasUpperCase && hasLowerCase && hasDigit && hasSpecial && hasMinLength) return null;

  return {
    strongPassword: {
      hasUpperCase,
      hasLowerCase,
      hasDigit,
      hasSpecial,
      hasMinLength,
    },
  };
}
