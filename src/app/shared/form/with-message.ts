import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function withMessage(validator: ValidatorFn, message: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const error = validator(control);
    if (!error) return null;

    const augmentedErrors: ValidationErrors = {};
    for (const key of Object.keys(error)) {
      augmentedErrors[key] = {
        ...(typeof error[key] === 'object' && error[key] !== null ? error[key] : { value: error[key] }),
        message
      };
    }
    return augmentedErrors;
  };
}
