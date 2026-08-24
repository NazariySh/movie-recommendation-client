import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const requiredRoles: string[] = route.data['roles'] ?? [];

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (!user) return router.createUrlTree(['/auth/login']);
      const hasRole = requiredRoles.some(role => user.roles.includes(role));
      if (hasRole) return true;
      return router.createUrlTree(['/']);
    })
  );
};
