import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

import { AuthModule } from '../auth/auth.module';
import { AppHeaderComponent } from './app-header/app.header.component';
import { Auth, AuthGuard, UnAuthGuard } from './auth-services'

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    FlexLayoutModule,
    ReactiveFormsModule,
    MaterialModule,
    AppHeaderComponent,
  ],
  declarations: [
    AppHeaderComponent,
  ],
  providers: [
    Auth,
    AuthGuard,
    UnAuthGuard,
  ],
})
export class SharedModule { }
