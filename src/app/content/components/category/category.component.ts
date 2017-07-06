import {
  Component, OnInit, OnChanges, Input, Output, EventEmitter, ViewChild,
  ChangeDetectionStrategy, SimpleChanges
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MdDialog, MdDialogRef, MdTooltip } from '@angular/material';
import { ItemFormComponent } from '../item-form/item-form.component';
import {
  IItemFormResult, ICategoryItems, IUpdateCategoryPayload,
  IRemoveCategoryPayload
} from '../../models';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CategoryComponent implements OnInit, OnChanges {
  changeCategoryForm: FormGroup;
  isInEditMode = false;

  @ViewChild('addItemTooltip', { read: MdTooltip }) addItemTooltip: MdTooltip;

  @Input() category: ICategoryItems;
  @Input() readonly isExpanded = false;
  @Input() readonly searchFor: string;
  @Output() update = new EventEmitter<IUpdateCategoryPayload>(false);
  @Output() remove = new EventEmitter<IRemoveCategoryPayload>(false);
  @Output() addItem = new EventEmitter<IItemFormResult>(false);

  constructor(
    private _fb: FormBuilder,
    private dialog: MdDialog
  ) { }

  ngOnInit() {
    this.changeCategoryForm = this._fb.group({
      newName: [this.category.name, [Validators.required, Validators.minLength(3)]]
    });
  }

  ngOnChanges(c: SimpleChanges) {
    if (c.isExpanded && !c.isExpanded.currentValue) {
      this.isInEditMode = false;
    }
  }

  toggleEditCategory(ev?: MouseEvent) {
    if (ev) { ev.stopPropagation(); }
    this.isInEditMode = !this.isInEditMode;
  }

  saveCategoryName() {
    if (this.changeCategoryForm.valid) {
      const toSubmit: IUpdateCategoryPayload = {
        id: this.category.id,
        name: this.changeCategoryForm.value.newName,
        initialName: this.category.name
      };
      this.update.emit(toSubmit);
      this.toggleEditCategory();
    }
  }

  promptDelete(ev: MouseEvent) {
    ev.stopPropagation();
    const dialogRef = this.dialog.open(DeleteCategoryDialogComponent);
    dialogRef.componentInstance.hasItems = this.category.items.length > 0;
    dialogRef.afterClosed().subscribe(chosenOption => {
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

@Component({
  selector: 'app-delete-category-dialog',
  template: `
  <h1 md-dialig-title>Delete category</h1>
  <md-dialog-content>Are you sure?</md-dialog-content>
  <md-dialog-actions>
    <button md-raised-button (click)="dialogRef.close('deleteAll')" *ngIf="hasItems" color="warn">
      Delete category and all its belongings
    </button>
    <button md-raised-button (click)="dialogRef.close('deleteJustCategory')" color="accent">
      {{hasItems ? 'Delete category, but save all its belongings' : 'Yes, delete'}}
    </button>
    <button md-button (click)="dialogRef.close()">Cancel</button>
  </md-dialog-actions>
  `,
})
export class DeleteCategoryDialogComponent {
  hasItems: boolean;
  constructor(public dialogRef: MdDialogRef<DeleteCategoryDialogComponent>) { }
}
