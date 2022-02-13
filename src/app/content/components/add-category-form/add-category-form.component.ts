import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-category-form',
  templateUrl: './add-category-form.component.html',
  styleUrls: ['./add-category-form.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddCategoryFormComponent implements OnInit {
  addCategoryForm: FormGroup;
  categoryControl = new FormControl('');
  @Output() add = new EventEmitter<string>(false);
  @ViewChild('category') categoryInput: ElementRef;

  constructor(private _fb: FormBuilder) {}

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
