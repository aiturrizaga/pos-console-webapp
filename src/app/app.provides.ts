import {
  AutoRefreshTokenService, createInterceptorCondition, INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  provideKeycloak,
  ProvideKeycloakOptions, UserActivityService,
  withAutoRefreshToken
} from 'keycloak-angular';
import { Provider } from '@angular/core';
import { environment } from '../environments/environment';

export const provideKeycloakAngular = () =>
  provideKeycloak({
    ...environment.keycloak as ProvideKeycloakOptions,
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 300000
      })
    ],
    providers: [AutoRefreshTokenService, UserActivityService]
  });

export function provideKeycloakTokenInterceptor(): Provider {
  const escapedBaseUrl = environment.api.gateway.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const apiUrlPattern = new RegExp(`^(${escapedBaseUrl})(/.*)?$`, 'i');

  const urlCondition = createInterceptorCondition({
    urlPattern: apiUrlPattern,
    bearerPrefix: 'Bearer'
  });

  return {
    provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    useValue: [urlCondition]
  };
}
