import { Component, OnInit, Input, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { CustomValidators } from 'ng2-validation';
import { IItem, IItemFormResult } from '@app/content/models';


@Component({
  selector: 'app-item-form',
  templateUrl: './item-form.component.html',
  styleUrls: ['./item-form.component.scss']
})
export class ItemFormComponent implements OnInit {
  @Input() item: IItem;
  saveItemForm: FormGroup;
  genopts: FormGroup;
  autoGenPassword: FormControl;
  public action: String;

  constructor(
    public dialogRef: MatDialogRef<ItemFormComponent>,
    private _fb: FormBuilder
  ) { }

  ngOnInit() {
    this.autoGenPassword = new FormControl(false);

    this.saveItemForm = this._fb.group({
      id: [this.item.id],
      name: [this.item.name, Validators.required],
      url: [this.item.url, CustomValidators.url],
      account: [this.item.account],
      username: [this.item.username],
      password: [this.item.password],
      blob: [this.item.blob],
      category_id: [this.item.category_id]
    });

    this.genopts = this._fb.group({
      numwords: [1]
    });
  }

  saveItem() {
    if (this.saveItemForm.valid) {
      const result: IItemFormResult = {
        item: this.saveItemForm.value,
        auto_pass: this.autoGenPassword.value,
        genopts: this.genopts.value
      };
      this.dialogRef.close(result);
    }
  }

  @HostListener('document:keydown', ['$event'])
  closeOnEsc(event: KeyboardEvent) {
    if (event.keyCode === 27) {
      this.dialogRef.close(null);
    }
  }
}
