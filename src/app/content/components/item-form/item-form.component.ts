import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  Input,
  OnInit,
} from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { urlValidator } from '../../../misc';
import { IItem, IItemFormResult } from '../../models';

@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ItemFormComponent implements OnInit {
  @Input() item: IItem;
  saveItemForm: UntypedFormGroup;
  genopts: UntypedFormGroup;
  autoGenPassword: UntypedFormControl;
  public action: String;

  constructor(
    public dialogRef: MatDialogRef<ItemFormComponent>,
    private _fb: UntypedFormBuilder
  ) {}

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
