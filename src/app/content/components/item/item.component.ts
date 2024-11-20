import { NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
} from '@angular/core';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltip } from '@angular/material/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { IItem, IItemFormResult, IUpdateItemPayload } from '../../models';
import { HighlightPipe } from '../../services/highlightPipe';
import { ItemFormComponent } from '../item-form/item-form.component';
import { ShowHidePasswordComponent } from '../show-hide-password/show-hide-password.component';

@Component({
  selector: 'app-delete-item-dialog',
  template: `
    <h1 mat-dialog-title>Delete item</h1>
    <mat-dialog-content>Are you sure?</mat-dialog-content>
    <mat-dialog-actions>
      <button
        mat-raised-button
        (click)="dialogRef.close('delete')"
        color="warn"
      >
        Yes, delete
      </button>
      <button mat-button (click)="dialogRef.close()">Cancel</button>
    </mat-dialog-actions>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatButton],
})
export class DeleteItemDialogComponent {
  dialogRef = inject<MatDialogRef<DeleteItemDialogComponent>>(MatDialogRef);
}

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[app-item]',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ClipboardModule,
    MatTooltip,
    ShowHidePasswordComponent,
    MatMiniFabButton,
    MatIcon,
    HighlightPipe,
  ],
})
export class ItemComponent {
  private dialog = inject(MatDialog);
  private snackbar = inject(MatSnackBar);

  @Input() item: IItem;
  @Input() searchFor: string | null;
  @Output() updateItem = new EventEmitter<IUpdateItemPayload>(false);
  @Output() removeItem = new EventEmitter<IItem>(false);

  promptEdit() {
    const dialogRef = this.dialog.open(ItemFormComponent);
    dialogRef.componentInstance.item = this.item;
    dialogRef.componentInstance.action = 'Edit item';
    dialogRef.afterClosed().subscribe((result: IItemFormResult) => {
      if (result) {
        this.updateItem.emit({
          newInfo: result,
          initialItem: this.item,
        });
      }
    });
  }

  promptDelete() {
    const dialogRef = this.dialog.open(DeleteItemDialogComponent);
    dialogRef.afterClosed().subscribe((chosenOption) => {
      if (chosenOption === 'delete') {
        this.removeItem.emit(this.item);
      }
    });
  }

  copied() {
    this.snackbar.open('copied', undefined, { duration: 2000 });
  }
}
