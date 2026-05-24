import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

@Injectable({ providedIn: 'root' })
export class ToastService {
  constructor(
    private readonly snackBar: MatSnackBar,
    private readonly translate: TranslateService,
  ) {}

  // Accepts either a translation key (`MOVIE.RATING_SAVED`) or a literal string.
  // Keys are resolved via ngx-translate; non-key strings pass through (instant()
  // returns the input when no entry matches).
  public show(message: string, type: ToastType = 'info', duration = 4000, params?: Record<string, unknown>): void {
    this.snackBar.open(this.translate.instant(message, params), '✕', {
      duration,
      panelClass: [`toast-${type}`],
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
    });
  }

  public success(message: string, params?: Record<string, unknown>): void {
    this.show(message, 'success', 4000, params);
  }

  public error(message: string, params?: Record<string, unknown>): void {
    this.show(message, 'error', 6000, params);
  }

  public info(message: string, params?: Record<string, unknown>): void {
    this.show(message, 'info', 4000, params);
  }

  public warning(message: string, params?: Record<string, unknown>): void {
    this.show(message, 'warning', 4000, params);
  }
}
