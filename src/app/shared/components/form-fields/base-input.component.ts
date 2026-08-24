import { Directive, Input, inject } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { ErrorMessageProvider } from '../../form/error-message.provider';

@Directive()
export abstract class BaseInputComponent implements ErrorStateMatcher {
  @Input() public control!: FormControl | AbstractControl | null;
  @Input() public label = '';
  @Input() public placeholder = '';
  @Input() public autocomplete = '';
  @Input() public externalError?: string | null;
  @Input() public errorMessage?: Record<string, string> | string;

  protected readonly errorMessageProvider = inject(ErrorMessageProvider);
  protected readonly translate = inject(TranslateService);

  public get formControl(): FormControl {
    return this.control as FormControl;
  }

  public isErrorState(control: AbstractControl | null): boolean {
    const hasExternalError = typeof this.errorMessage === 'string' && !!this.errorMessage;
    return !!((this.externalError || hasExternalError) && this.control?.touched) ||
      !!(this.control?.invalid && this.control?.touched) ||
      !!(control?.invalid && control?.touched);
  }

  public get displayError(): string | null {
    const raw = this.resolveRawError();
    return raw ? this.translateIfKey(raw) : null;
  }

  private resolveRawError(): string | null {
    if (this.externalError) {
      return this.externalError;
    }

    if (typeof this.errorMessage === 'string' && this.errorMessage) {
      return this.errorMessage;
    }

    if (this.control?.errors) {
      if (typeof this.errorMessage === 'object' && this.errorMessage && Object.keys(this.errorMessage).length > 0) {
        for (const key of Object.keys(this.control.errors)) {
          if (this.errorMessage[key]) {
            return this.errorMessage[key];
          }
        }
      }
      return this.errorMessageProvider.getErrorMessage(this.control.errors);
    }

    return null;
  }

  private translateIfKey(value: string): string {
    const translated = this.translate.instant(value);
    return typeof translated === 'string' ? translated : value;
  }
}
