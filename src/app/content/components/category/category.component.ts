import { NgIf } from '@angular/common';
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
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButton, MatMiniFabButton } from '@angular/material/button';
import {
  MatDialog,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import { NgxErrorsModule } from '@ngspot/ngx-errors';
import {
  ICategoryItems,
  IItemFormResult,
  IRemoveCategoryPayload,
  IUpdateCategoryPayload,
} from '../../models';
import { CapitalizePipe } from '../../services/capitalizePipe';
import { HighlightPipe } from '../../services/highlightPipe';
import { ItemFormComponent } from '../item-form/item-form.component';

@Component({
  selector: 'app-delete-category-dialog',
  template: `
    <h1 mat-dialog-title>Delete category</h1>
    <mat-dialog-content>Are you sure?</mat-dialog-content>
    <mat-dialog-actions class="flex flex-col gap-4">
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    NgIf,
    MatButton,
  ],
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
  standalone: true,
  imports: [
    NgIf,
    MatMiniFabButton,
    MatTooltip,
    MatIcon,
    ReactiveFormsModule,
    NgxErrorsModule,
    MatFormField,
    MatLabel,
    MatInput,
    HighlightPipe,
    CapitalizePipe,
  ],
})
export class CategoryComponent implements OnInit, OnChanges {
  changeCategoryForm: UntypedFormGroup;
  isInEditMode = false;

  @ViewChild('addItemTooltip', { read: MatTooltip }) addItemTooltip: MatTooltip;

  @Input() category: ICategoryItems;
  @Input() readonly isExpanded: boolean = false;
  @Input() readonly searchFor: string | null;
  @Output() update = new EventEmitter<IUpdateCategoryPayload>(false);
  @Output() remove = new EventEmitter<IRemoveCategoryPayload>(false);
  @Output() addItem = new EventEmitter<IItemFormResult>(false);

  constructor(private _fb: UntypedFormBuilder, private dialog: MatDialog) {}

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
