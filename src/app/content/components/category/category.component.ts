import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatTooltip } from '@angular/material/tooltip';
import {
  ICategoryItems,
  IItemFormResult,
  IRemoveCategoryPayload,
  IUpdateCategoryPayload,
} from '../../models';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-delete-category-dialog',
  template: `
    <h1 mat-dialig-title>Delete category</h1>
    <mat-dialog-content>Are you sure?</mat-dialog-content>
    <mat-dialog-actions>
      <button
        mat-raised-button
        (click)="dialogRef.close('deleteAll')"
        *ngIf="hasItems"
        color="warn"
      >
        Delete category and all its belongings
      </button>
      <button
        mat-raised-button
        (click)="dialogRef.close('deleteJustCategory')"
        color="accent"
      >
        {{
          hasItems
            ? 'Delete category, but save all its belongings'
            : 'Yes, delete'
        }}
      </button>
      <button mat-button (click)="dialogRef.close()">Cancel</button>
    </mat-dialog-actions>
  `,
})
export class DeleteCategoryDialogComponent {
  hasItems: boolean;
  constructor(public dialogRef: MatDialogRef<DeleteCategoryDialogComponent>) {}
}

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryComponent implements OnInit, OnChanges {
  changeCategoryForm: FormGroup;
  isInEditMode = false;

  @ViewChild('addItemTooltip', { read: MatTooltip }) addItemTooltip: MatTooltip;

  @Input() category: ICategoryItems;
  @Input() readonly isExpanded = false;
  @Input() readonly searchFor: string | null;
  @Output() update = new EventEmitter<IUpdateCategoryPayload>(false);
  @Output() remove = new EventEmitter<IRemoveCategoryPayload>(false);
  @Output() addItem = new EventEmitter<IItemFormResult>(false);

  constructor(private _fb: FormBuilder, private dialog: MatDialog) {}

  ngOnInit() {
    this.changeCategoryForm = this._fb.group({
      newName: [
        this.category.name,
        [Validators.required, Validators.minLength(3)],
      ],
    });
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.isExpanded && !c.isExpanded.currentValue) {
      this.isInEditMode = false;
    }
  }

  toggleEditCategory(ev?: MouseEvent) {
    if (ev) {
      ev.stopPropagation();
    }
    this.isInEditMode = !this.isInEditMode;
  }

  saveCategoryName() {
    if (this.changeCategoryForm.valid) {
      const toSubmit: IUpdateCategoryPayload = {
        id: this.category.id,
        name: this.changeCategoryForm.value.newName,
        initialName: this.category.name,
      };
      this.update.emit(toSubmit);
      this.toggleEditCategory();
    }
  }

  promptDelete(ev: MouseEvent) {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(DeleteCategoryDialogComponent);
    dialogRef.componentInstance.hasItems = this.category.items.length > 0;
    dialogRef.afterClosed().subscribe((chosenOption) => {
      if (chosenOption) {
        const cascade = chosenOption === 'deleteAll';
        this.remove.emit({ category: this.category, cascade: cascade });
      }
    });
  }

  promptAddItem(ev: MouseEvent) {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(ItemFormComponent);
    dialogRef.componentInstance.item = { category_id: this.category.id } as any;
    dialogRef.componentInstance.action = 'Add new item';
    dialogRef.afterClosed().subscribe((newItem: IItemFormResult) => {
      if (newItem) {
        this.addItem.emit(newItem);
      }
    });
  }
}
