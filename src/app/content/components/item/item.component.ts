import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IItem, IItemFormResult, IUpdateItemPayload } from '../../models';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-delete-item-dialog',
  template: `
    <h1 mat-dialig-title>Delete item</h1>
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
})
export class DeleteItemDialogComponent {
  constructor(public dialogRef: MatDialogRef<DeleteItemDialogComponent>) {}
}

@Component({
  // tslint:disable-next-line:component-selector
  selector: '[app-item]',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent implements OnInit {
  @Input() item: IItem;
  @Input() searchFor: string | null;
  @Output() updateItem = new EventEmitter<IUpdateItemPayload>(false);
  @Output() removeItem = new EventEmitter<IItem>(false);

  constructor(private dialog: MatDialog, private snackbar: MatSnackBar) {}

  ngOnInit() {}

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
