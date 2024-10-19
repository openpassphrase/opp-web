import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { ServiceWorkerModule } from '@angular/service-worker';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../environments/environment';
import { ROUTES } from './app-routes';
import { AuthStorage } from './core/auth-token-storage';
import {
  AuthApiMockService,
  AuthApiService,
} from './core/auth/auth-api.service';
import { AuthStateService } from './core/auth/auth-state.service';
import { AuthService } from './core/auth/auth.service';
import { PhraseInterceptor } from './core/auth/phrase.interceptor';
import { CspService } from './core/csp.service';
import { LoadingInterceptor } from './core/loading.interceptor';
import { PwaService } from './core/pwa.service';

export function tokenGetter() {
  return AuthStorage.getToken();
}

const APP_HTTP_PROVIDERS = [
  importProvidersFrom(
    JwtModule.forRoot({
      config: {
        tokenGetter,
        headerName: 'x-opp-jwt',
        authScheme: '',
      },
    })
  ),
  provideHttpClient(withInterceptorsFromDi(), withFetch()),
  {
    provide: AuthApiService,
    useClass: environment.mockApi ? AuthApiMockService : AuthApiService,
  },
  AuthService,
  AuthStateService,
  {
    provide: HTTP_INTERCEPTORS,
    useClass: LoadingInterceptor,
    multi: true,
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: PhraseInterceptor,
    multi: true,
  },
];

const swJs = `${environment.baseHref}/ngsw-worker.js`;

const PWA_PROVIDERS = [
  PwaService,
  importProvidersFrom(
    ServiceWorkerModule.register(swJs, { enabled: environment.name !== 'dev' })
  ),
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(ROUTES),
    importProvidersFrom(MatSnackBarModule),
    provideAnimations(),
    APP_HTTP_PROVIDERS,
    PWA_PROVIDERS,
    CspService,
  ],
};
