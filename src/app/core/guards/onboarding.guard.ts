import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { AppRoutes, AuthRoutes } from '../constants/app-routes';

export const onboardingGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1),
    map(user => {
      if (!user) return router.createUrlTree(['/', AppRoutes.AUTH, AuthRoutes.LOGIN]);
      if (!user.onboardingCompleted) return router.createUrlTree(['/onboarding']);
      return true;
    })
  );
};
