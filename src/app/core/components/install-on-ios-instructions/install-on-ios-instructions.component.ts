import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-install-on-ios-instructions',
  templateUrl: './install-on-ios-instructions.component.html',
  styleUrls: ['./install-on-ios-instructions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButton],
})
export class InstallOnIosInstructionsComponent {
  private snackBarRef =
    inject<MatSnackBarRef<InstallOnIosInstructionsComponent>>(MatSnackBarRef);

  dismiss() {
    this.snackBarRef.dismiss();
  }
}
