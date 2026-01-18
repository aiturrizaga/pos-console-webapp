import { AuthGuardData, createAuthGuard } from 'keycloak-angular';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { inject } from '@angular/core';

const isAccessAllowed = async (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot,
  authData: AuthGuardData
): Promise<boolean | UrlTree> => {

  const { authenticated, grantedRoles } = authData;
  const requiredRoles: string[] | undefined = route.data['roles'];

  if (!requiredRoles || requiredRoles.length === 0) {
    return false;
  }

  const userRoles = Object.values(grantedRoles.resourceRoles).flat();

  const hasMatch = requiredRoles.some(reqRole =>
    userRoles.includes(reqRole)
  );

  if (authenticated && hasMatch) {
    return true;
  }

  const router = inject(Router);
  return router.parseUrl(`/unauthorized?returnUrl=${ state.url }`);
};

export const canActivateAuthRole = createAuthGuard<CanActivateFn>(isAccessAllowed);
