import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MdInputModule, MdToolbarModule, MdSnackBarModule, MdButtonModule,
  MdTooltipModule, MdSelectModule, MdProgressBarModule, MdDialogModule,
  MdIconModule, MdCheckboxModule, MdExpansionModule
} from '@angular/material';

import { AppHeaderComponent } from './app-header/app.header.component';
import { AutofocusDirective } from 'app/shared/directives/autofocus';

export const ANGULAR_MATERIAL_MODULES = [
  MdInputModule, MdToolbarModule, MdSnackBarModule, MdButtonModule,
  MdTooltipModule, MdSelectModule, MdProgressBarModule, MdDialogModule,
  MdIconModule, MdCheckboxModule, MdExpansionModule
];

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ...ANGULAR_MATERIAL_MODULES,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    ...ANGULAR_MATERIAL_MODULES,
    ReactiveFormsModule,
    AppHeaderComponent,
    AutofocusDirective
  ],
  declarations: [
    AppHeaderComponent,
    AutofocusDirective
  ],
})
export class SharedModule { }
