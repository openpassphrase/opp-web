import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef, Renderer, HostListener } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-category-form',
  templateUrl: './add-category-form.component.html',
  styleUrls: ['./add-category-form.component.scss']
})
export class AddCategoryFormComponent implements OnInit {
  addCategoryForm: FormGroup;
  @Output() add = new EventEmitter<string>(false);
  @ViewChild('category') categoryInput: ElementRef;

  constructor(private _fb: FormBuilder, private renderer: Renderer) { }

  ngOnInit() {
    this.addCategoryForm = this._fb.group({
      category: ['', Validators.required]
    });
  }

  addCategory() {
    if (this.addCategoryForm.valid) {
      this.renderer.invokeElementMethod(this.categoryInput.nativeElement, 'blur');
      const name = this.addCategoryForm.value.category.trim();
      this.add.emit(name);
      this.addCategoryForm.controls['category'].setValue('');
    }
  }

  clear() {
    this.addCategoryForm.get('category').setValue('');
  }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event.key === 'n' &&
      event.altKey &&
      event.ctrlKey) {
      this.renderer.invokeElementMethod(this.categoryInput.nativeElement, 'focus');
    }
  }
}
