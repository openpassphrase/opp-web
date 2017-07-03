import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-category-form',
  templateUrl: './add-category-form.component.html',
  styleUrls: ['./add-category-form.component.scss']
})
export class AddCategoryFormComponent implements OnInit {
  addCategoryForm: FormGroup;
  categoryControl = new FormControl('', Validators.required);
  @Output() add = new EventEmitter<string>(false);
  @ViewChild('category') categoryInput: ElementRef;

  constructor(private _fb: FormBuilder, private renderer: Renderer) { }

  ngOnInit() {
    this.addCategoryForm = this._fb.group({
      category: this.categoryControl
    });
  }

  addCategory() {
    if (this.addCategoryForm.valid) {
      this.renderer.invokeElementMethod(this.categoryInput.nativeElement, 'blur');
      const name = this.addCategoryForm.value.category.trim();
      this.add.emit(name);
      this.clear();
    }
  }

  clear() {
    this.categoryControl.setValue('');
  }
}
