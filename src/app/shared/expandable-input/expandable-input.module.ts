import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  ExpandableInputComponent,
  ExpIconActionDirective,
  ExpIconCloseDirective,
  ExpIconOpenDirective,
  ExpInputDirective,
} from '@ngspot/expandable-input';
import { AppExpandableInputComponent } from './expandable-input.component';

// after ng 15.2 we can use EXPANDABLE_INPUT_DIRECTIVES from
// @ngspot/expandable-input instead
const EXPANDABLE_DIRECTIVES = [
  ExpandableInputComponent,
  ExpIconActionDirective,
  ExpIconCloseDirective,
  ExpIconOpenDirective,
  ExpInputDirective,
];

@NgModule({
  imports: [
    CommonModule,
    EXPANDABLE_DIRECTIVES,
    MatIconModule,
    MatButtonModule,
  ],
  declarations: [AppExpandableInputComponent],
  exports: [EXPANDABLE_DIRECTIVES, AppExpandableInputComponent],
})
export class ExpandableInputModule {}
