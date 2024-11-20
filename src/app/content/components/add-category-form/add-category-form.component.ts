import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import {
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatTooltip } from '@angular/material/tooltip';
import {
  ExpIconActionDirective,
  ExpIconCloseDirective,
  ExpIconOpenDirective,
  ExpInputDirective,
} from '@ngspot/expandable-input';

import { AutofocusDirective } from '../../../shared/directives/autofocus';
import { AppExpandableInputComponent } from '../../../shared/expandable-input';

@Component({
  selector: 'app-add-category-form',
  templateUrl: './add-category-form.component.html',
  styleUrls: ['./add-category-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ExpInputDirective,
    MatFormField,
    MatLabel,
    MatInput,
    AutofocusDirective,
    ExpIconOpenDirective,
    MatMiniFabButton,
    MatTooltip,
    MatIcon,
    ExpIconCloseDirective,
    ExpIconActionDirective,
    AppExpandableInputComponent,
  ],
})
export class AddCategoryFormComponent implements OnInit {
  private _fb = inject(UntypedFormBuilder);

  addCategoryForm: UntypedFormGroup;
  categoryControl = new UntypedFormControl('');

  @Output() add = new EventEmitter<string>(false);

  @ViewChild('category', { read: ElementRef<HTMLElement> })
  private categoryInput: ElementRef<HTMLElement>;

  @ViewChild(AppExpandableInputComponent, { static: true })
  expandableInput: AppExpandableInputComponent;

  get isOpen() {
    return this.expandableInput?.isOpen;
  }

  ngOnInit() {
    this.addCategoryForm = this._fb.group({
      category: this.categoryControl,
    });
  }

  addCategory() {
    if (this.categoryControl.value.length) {
      this.categoryInput.nativeElement.blur();
      const name = this.addCategoryForm.value.category.trim();
      this.add.emit(name);
      this.clear();
    }
  }

  clear() {
    this.categoryControl.setValue('');
  }
}
