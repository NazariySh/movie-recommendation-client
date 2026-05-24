import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { AppPaths, AuthPaths } from '../constants/app-routes';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const toast = inject(ToastService);
  const translate = inject(TranslateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 400 || error.status === 422) {
        return throwError(() => error);
      }

      switch (error.status) {
        case 0:
          router.navigate([AppPaths.ERROR], {
            state: { message: translate.instant('ERRORS.NETWORK') },
          });
          break;

        case 401:
          if (isUrl(error, '/auth/login')) {
            toast.error(translate.instant('AUTH.ERROR.INVALID_CREDENTIALS'));
          } else if (!isUrl(error, '/auth/')) {
            toast.warning(translate.instant('AUTH.ERROR.SESSION_EXPIRED'));
            router.navigate([AuthPaths.LOGIN]);
          }
          break;

        case 403:
          toast.error(translate.instant('ERRORS.FORBIDDEN'));
          break;

        case 404:
          router.navigate([AppPaths.NOT_FOUND]);
          break;

        case 409:
          toast.error(translate.instant('AUTH.ERROR.ALREADY_EXISTS'));
          break;

        case 423:
          toast.error(translate.instant('AUTH.ERROR.ACCOUNT_LOCKED'));
          break;

        case 429:
          toast.warning(translate.instant('ERRORS.RATE_LIMIT'));
          break;

        default:
          if (error.status >= 500) {
            router.navigate([AppPaths.ERROR], {
              state: { message: translate.instant('ERRORS.SERVER') },
            });
          } else {
            toast.error(translate.instant('ERRORS.GENERIC'));
          }
      }

      return throwError(() => error);
    })
  );
};

function isUrl(error: HttpErrorResponse, segment: string): boolean {
  return !!error.url && error.url.includes(segment);
}
