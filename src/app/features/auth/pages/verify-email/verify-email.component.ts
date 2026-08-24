import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { EMPTY, timer } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../../core/services/auth.service';
import { AuthPaths } from '../../../../core/constants/app-routes';
import { withMessage } from '../../../../shared/form/with-message';
import { wrapWithSpinner, globalSpinner$ } from '../../../../shared/utils/wrap-with-spinner';

type VerifyState = 'pending' | 'success' | 'error';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VerifyEmailComponent implements OnInit {
  public readonly AuthPaths = AuthPaths;
  public readonly loading$ = globalSpinner$;
  public state: VerifyState = 'pending';
  public resendSent = false;
  public emailControl = new FormControl('', {
    nonNullable: true,
    validators: [
      withMessage(Validators.required, 'AUTH.ERROR.REQUIRED'),
      withMessage(Validators.email, 'AUTH.ERROR.EMAIL_INVALID'),
    ],
  });

  constructor(
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly destroyRef: DestroyRef,
    private readonly cdr: ChangeDetectorRef
  ) {}

  public ngOnInit(): void {
    const userId = this.route.snapshot.queryParams['userId'];
    const token = this.route.snapshot.queryParams['token'];

    if (!userId || !token) {
      this.state = 'error';
      return;
    }

    this.authService
      .verifyEmail({ userId, token })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.state = 'success';
          this.cdr.markForCheck();
          timer(2500)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(() => this.router.navigate([AuthPaths.LOGIN]));
        },
        error: () => {
          this.state = 'error';
          this.cdr.markForCheck();
        },
      });
  }

  public resendVerification(): void {
    if (this.emailControl.invalid) {
      this.emailControl.markAsTouched();
      return;
    }

    wrapWithSpinner(
      this.authService.resendVerification({ email: this.emailControl.value }).pipe(
        catchError(() => {
          this.resendSent = true;
          this.cdr.markForCheck();
          return EMPTY;
        })
      )
    )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.resendSent = true;
        this.cdr.markForCheck();
      });
  }
}
