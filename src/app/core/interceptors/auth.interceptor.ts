import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, catchError, finalize, shareReplay, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

let inflightRefresh: Observable<string> | null = null;

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  const authService = inject(AuthService);
  const token = authService.accessToken;

  const authedReq = token ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : req;

  return next(authedReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status !== 401 || isAuthEndpoint(req.url)) {
        return throwError(() => error);
      }

      inflightRefresh ??= authService.refreshToken().pipe(
        finalize(() => { inflightRefresh = null; }),
        shareReplay({ bufferSize: 1, refCount: false }),
      );

      return inflightRefresh.pipe(
        switchMap(newToken => next(req.clone({ setHeaders: { Authorization: `Bearer ${newToken}` } }))),
        catchError(refreshErr => {
          authService.clearSession();
          return throwError(() => refreshErr);
        }),
      );
    }),
  );
};

function isAuthEndpoint(url: string): boolean {
  return /\/auth\/(refresh|login|register|google|forgot-password|reset-password|verify-email|resend-verification)(\b|\/)/.test(url);
}
