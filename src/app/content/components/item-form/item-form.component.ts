import { NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnInit,
  inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCard } from '@angular/material/card';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatOption } from '@angular/material/core';
import {
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatError, MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import {
  NGX_ERRORS_MATERIAL_DECLARATIONS,
  provideNgxErrorsConfig,
} from '@ngspot/ngx-errors-material';
import { urlValidator } from '../../../misc';
import { IItem, IItemFormResult } from '../../models';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    NGX_ERRORS_MATERIAL_DECLARATIONS,
    MatFormField,
    MatLabel,
    MatInput,
    MatError,
    MatCheckbox,
    NgIf,
    MatCard,
    MatSelect,
    NgFor,
    MatOption,
    MatButton,
  ],
  providers: [
    provideNgxErrorsConfig({
      showErrorsWhenInput: 'dirty',
      showMaxErrors: 1,
    }),
  ],
})
export class ItemFormComponent implements OnInit {
  dialogRef = inject<MatDialogRef<ItemFormComponent>>(MatDialogRef);
  private _fb = inject(UntypedFormBuilder);

  @Input() item: IItem;
  saveItemForm: UntypedFormGroup;
  genopts: UntypedFormGroup;
  autoGenPassword: UntypedFormControl;
  public action: String;

  ngOnInit() {
    this.autoGenPassword = new UntypedFormControl(false);

    this.saveItemForm = this._fb.group({
      id: [this.item.id],
      name: [this.item.name, Validators.required],
      url: [this.item.url, urlValidator],
      account: [this.item.account],
      username: [this.item.username],
      password: [this.item.password],
      blob: [this.item.blob],
      category_id: [this.item.category_id],
    });

    this.genopts = this._fb.group({
      numChars: [16],
    });
  }

  saveItem() {
    if (this.saveItemForm.valid) {
      const result: IItemFormResult = {
        item: this.saveItemForm.value,
        auto_pass: this.autoGenPassword.value,
        genopts: this.genopts.value,
      };
      this.dialogRef.close(result);
    }
  }

  @HostListener('document:keydown', ['$event'])
  closeOnEsc(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      this.dialogRef.close(null);
    }
  }
}
