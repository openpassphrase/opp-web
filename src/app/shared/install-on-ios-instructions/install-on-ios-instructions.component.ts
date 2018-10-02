import { Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material';

@Component({
  selector: 'app-install-on-ios-instructions',
  templateUrl: './install-on-ios-instructions.component.html',
  styleUrls: ['./install-on-ios-instructions.component.scss']
})
export class InstallOnIosInstructionsComponent {
  constructor(private snackBarRef: MatSnackBarRef<InstallOnIosInstructionsComponent>) { }

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
