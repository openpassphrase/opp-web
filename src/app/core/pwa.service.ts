import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { UpdateAvailableComponent } from '@app/shared/update-available/update-available.component';
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class PwaService {
  private promptEventSubj$ = new BehaviorSubject<any>(undefined);
  promptEvent$ = this.promptEventSubj$.asObservable();

  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar,
    @Inject(DOCUMENT) private doc: Document
  ) {
    window.addEventListener('beforeinstallprompt', event => {
      this.promptEventSubj$.next(event);
    });
  }

  listenForUpdate() {
    this.swUpdate.available.subscribe(() => {
      this.snackBar.openFromComponent(UpdateAvailableComponent);
    });
  }

  promptInstallPwa() {
    this.promptEventSubj$.getValue().prompt();
  }

  register() {
    if (environment.name !== 'dev' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration()
        .then(sw => {
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
}
