import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from '../../environments/environment';
import { AuthStorage } from './auth-token-storage';
import { AuthApiMockService, AuthApiService } from './auth/auth-api.service';
import { AuthStateService } from './auth/auth-state.service';
import { AuthService } from './auth/auth.service';
import { InstallOnIosInstructionsComponent } from './components/install-on-ios-instructions/install-on-ios-instructions.component';
import { UpdateAvailableComponent } from './components/update-available/update-available.component';
import { CspService } from './csp.service';
import { LoadingInterceptor } from './loading.interceptor';
import { PwaService } from './pwa.service';

const swJs = `${environment.baseHref}/ngsw-worker.js`;

export function tokenGetter() {
  return AuthStorage.getToken();
}

/**
 * Only keep dependencies absolutely necessary for the initial page load in this module
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatSnackBarModule,
    MatButtonModule,
    ServiceWorkerModule.register(swJs, { enabled: environment.name !== 'dev' }),
    JwtModule.forRoot({
      config: { tokenGetter, headerName: 'x-opp-jwt', authScheme: '' },
    }),
  ],
  declarations: [UpdateAvailableComponent, InstallOnIosInstructionsComponent],
  entryComponents: [
    UpdateAvailableComponent,
    InstallOnIosInstructionsComponent,
  ],
  providers: [
    PwaService,
    CspService,
    AuthService,
    AuthStateService,
    {
      provide: AuthApiService,
      useClass: environment.mockApi ? AuthApiMockService : AuthApiService,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoadingInterceptor,
      multi: true,
    },
  ],
})
export class CoreModule {
  constructor(pwa: PwaService, csp: CspService) {
    pwa.addManifestLink();

    // in some cases ServiceWorkerModule.register does not register service worker.
    // https://github.com/angular/angular/issues/20970
    // register it manually:
    pwa.register();

    pwa.listenForUpdate();

    csp.register();
  }
}
