import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { retry, throwError, timer } from 'rxjs';

const MAX_RETRIES = 3;

const RETRIABLE_4XX = new Set([408, 429]);

export const retryInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') return next(req);

  return next(req).pipe(
    retry({
      count: MAX_RETRIES,
      delay: (error, attempt) => {
        const status = error instanceof HttpErrorResponse ? error.status : 0;
        const retriable = status === 0 || status >= 500 || RETRIABLE_4XX.has(status);
        if (!retriable) {
          return throwError(() => error);
        }
        return timer(Math.pow(2, attempt) * 500);
      },
    }),
  );
};
