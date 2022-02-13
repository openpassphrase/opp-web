import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-available',
  templateUrl: './update-available.component.html',
  styleUrls: ['./update-available.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpdateAvailableComponent {
  constructor(private snackBarRef: MatSnackBarRef<UpdateAvailableComponent>) {}

  dismiss() {
    this.snackBarRef.dismiss();
  }

  reload() {
    window.location.reload();
    this.dismiss();
  }
}
