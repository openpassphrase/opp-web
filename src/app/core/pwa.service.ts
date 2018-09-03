import { Injectable } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { MatSnackBar } from '@angular/material';
import { UpdateAvailableComponent } from '@app/shared/update-available/update-available.component';
import { environment } from '../../environments/environment';

@Injectable()
export class PwaService {
  promptEvent: any;

  constructor(
    private swUpdate: SwUpdate,
    private snackBar: MatSnackBar
  ) {
    window.addEventListener('beforeinstallprompt', event => {
      console.log('beforeinstallprompt', event);
      // TODO: I want to make sure this event is triggered on https
      // delete this alert when make sure of that
      alert('beforeinstallprompt');
      this.promptEvent = event;
    });
  }

  listenForUpdate() {
    this.swUpdate.available.subscribe(() => {
      this.snackBar.openFromComponent(UpdateAvailableComponent);
    });
  }

  promptInstallPwa() {
    this.promptEvent.prompt();
  }

  register() {
    if (environment.production && 'serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration()
        .then(sw => {
          if (!sw) {
            navigator.serviceWorker.register('./ngsw-worker.js');
          }
        })
        .catch(console.error);
    }
  }
}
