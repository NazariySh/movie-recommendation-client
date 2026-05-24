import { AbstractControl, ValidationErrors } from '@angular/forms';

export function minArrayValidator(min: number) {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!Array.isArray(value)) return { minArray: { min, actual: 0 } };
    return value.length >= min ? null : { minArray: { min, actual: value.length } };
  };
}
