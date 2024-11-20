import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatSnackBarRef } from '@angular/material/snack-bar';

@Component({
  selector: 'app-update-available',
  templateUrl: './update-available.component.html',
  styleUrls: ['./update-available.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButton],
})
export class UpdateAvailableComponent {
  private snackBarRef =
    inject<MatSnackBarRef<UpdateAvailableComponent>>(MatSnackBarRef);

  dismiss() {
    this.snackBarRef.dismiss();
  }

  reload() {
    window.location.reload();
    this.dismiss();
  }
}
