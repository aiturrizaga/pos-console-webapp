import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';
import { includeBearerTokenInterceptor } from 'keycloak-angular';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideKeycloakAngular, provideKeycloakTokenInterceptor } from '@/app.provides';
import { AppBootstrap } from '@/core/services/session/app-bootstrap';
import { tenantCompanyInterceptor } from '@/core/interceptors/tenant-company-interceptor';

const SystemPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: '{purple.50}',
      100: '{purple.100}',
      200: '{purple.200}',
      300: '{purple.300}',
      400: '{purple.400}',
      500: '{purple.500}',
      600: '{purple.600}',
      700: '{purple.700}',
      800: '{purple.800}',
      900: '{purple.900}',
      950: '{purple.950}',
    },
    colorScheme: {
      light: {
        primary: {
          color: '{purple.800}',
          inverseColor: '#ffffff',
          hoverColor: '{purple.900}',
          activeColor: '{purple.800}',
        },
        highlight: {
          background: '{purple.950}',
          focusBackground: '{purple.700}',
          color: '#ffffff',
          focusColor: '#ffffff',
        },
      },
      dark: {
        primary: {
          color: '{purple.50}',
          inverseColor: '{purple.950}',
          hoverColor: '{purple.100}',
          activeColor: '{purple.200}',
        },
        highlight: {
          background: 'rgba(250, 250, 250, .16)',
          focusBackground: 'rgba(250, 250, 250, .24)',
          color: 'rgba(255,255,255,.87)',
          focusColor: 'rgba(255,255,255,.87)',
        },
      },
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes, withComponentInputBinding()),
    provideAppInitializer(() => {
      const bs = inject(AppBootstrap);
      return bs.init();
    }),
    providePrimeNG({
      theme: {
        preset: SystemPreset
      }
    }),
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor, tenantCompanyInterceptor])),
    provideKeycloakAngular(),
    provideKeycloakTokenInterceptor()
  ]
};
