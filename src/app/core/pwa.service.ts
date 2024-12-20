import { DOCUMENT } from '@angular/common';
import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { InstallOnIosInstructionsComponent } from './components/install-on-ios-instructions/install-on-ios-instructions.component';
import { UpdateAvailableComponent } from './components/update-available/update-available.component';
@Injectable()
export class PwaService {
  private swUpdate = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);
  private doc = inject<Document>(DOCUMENT);

  private promptEventSubj$ = new BehaviorSubject<any>(undefined);
  private isAppInstalledSubj$ = new BehaviorSubject<boolean>(false);
  promptEvent$ = this.promptEventSubj$.asObservable();
  showCustomButton$: Observable<boolean>;
  showIosCustomButton = this.isIos() && !this.isInStandaloneMode();

  constructor() {
    window.addEventListener('beforeinstallprompt', (event) => {
      this.promptEventSubj$.next(event);
    });

    window.addEventListener('appinstalled', () => {
      this.isAppInstalledSubj$.next(true);
    });

    this.showCustomButton$ = combineLatest([
      this.promptEvent$,
      this.isAppInstalledSubj$.asObservable(),
    ]).pipe(
      map(([promptEvent, isAppInstalled]) => !!promptEvent && !isAppInstalled)
    );
  }

  listenForUpdate() {
    this.swUpdate.versionUpdates
      .pipe(filter((event) => event.type === 'VERSION_READY'))
      .subscribe(() => {
        this.snackBar.openFromComponent(UpdateAvailableComponent);
      });
  }

  promptInstallPwa() {
    this.promptEventSubj$.getValue().prompt();
  }

  promptInstallPwaOnIos() {
    this.snackBar.openFromComponent(InstallOnIosInstructionsComponent);
  }

  register() {
    if (environment.name !== 'dev' && 'serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistration()
        .then((sw) => {
          if (!sw) {
            const swJs = `${environment.baseHref}/ngsw-worker.js`;
            navigator.serviceWorker.register(swJs);
          }
        })
        .catch(console.error);
    }
  }

  addManifestLink() {
    const link: HTMLLinkElement = this.doc.createElement('link');
    link.setAttribute('rel', 'manifest');
    link.setAttribute('href', `${environment.baseHref}/manifest.json`);
    this.doc.head.appendChild(link);
  }

  private isIos() {
    const userAgent = window.navigator.userAgent.toLowerCase();
    const match = /iphone|ipad|ipod/.test(userAgent);
    return match;
  }

  private isInStandaloneMode() {
    return (
      'standalone' in window.navigator &&
      (window.navigator as any).standalone === true
    );
  }
}
