import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { AuthModule } from '../auth/auth.module';
import { AppHeaderComponent } from '../app-header/app.header.component';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    AuthModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    AuthModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  declarations: [
    AppHeaderComponent,
  ]
})
export class SharedModule { }
