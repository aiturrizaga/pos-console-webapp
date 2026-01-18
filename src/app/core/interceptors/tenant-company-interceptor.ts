import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { SessionStore } from '@/core/services/session/session-store';

export const tenantCompanyInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionStore = inject(SessionStore);

  const tenantId = sessionStore.tenantId();
  const companyId = sessionStore.companyId();

  if (!tenantId && !companyId) {
    return next(req);
  }

  const headers: Record<string, string> = {};

  if (tenantId) {
    headers['Tenant-Id'] = tenantId;
  }

  if (companyId) {
    headers['Company-Id'] = companyId;
  }

  const clonedRequest = req.clone({
    setHeaders: headers,
  });

  return next(clonedRequest);
};
