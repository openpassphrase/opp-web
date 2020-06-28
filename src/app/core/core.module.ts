import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../../environments/environment';
import { AppHttpModule } from './app-http.module';
import { AuthStateService } from './auth/auth-state.service';
import { AuthService } from './auth/auth.service';
import { InstallOnIosInstructionsComponent } from './components/install-on-ios-instructions/install-on-ios-instructions.component';
import { UpdateAvailableComponent } from './components/update-available/update-available.component';
import { CspService } from './csp.service';
import { PwaService } from './pwa.service';

const swJs = `${environment.baseHref}/ngsw-worker.js`;

/**
 * Only keep dependencies absolutely necessary for the initial page load in this module
 */
@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppHttpModule,
    MatSnackBarModule,
    MatButtonModule,
    MatDialogModule,
    ServiceWorkerModule.register(swJs, { enabled: environment.name !== 'dev' }),
  ],
  declarations: [UpdateAvailableComponent, InstallOnIosInstructionsComponent],
  entryComponents: [
    UpdateAvailableComponent,
    InstallOnIosInstructionsComponent,
  ],
  providers: [PwaService, CspService, AuthService, AuthStateService],
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
