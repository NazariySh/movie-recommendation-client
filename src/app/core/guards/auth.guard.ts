import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AppRoutes, AuthRoutes } from '../constants/app-routes';

export const authGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isAuthenticated$.pipe(
    take(1),
    map(isAuth => {
      if (isAuth) return true;
      return router.createUrlTree(['/', AppRoutes.AUTH, AuthRoutes.LOGIN], {
        queryParams: { returnUrl: state.url },
      });
    })
  );
};
