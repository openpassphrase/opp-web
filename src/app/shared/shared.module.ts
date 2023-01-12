import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppHeaderComponent } from './app-header/app.header.component';
import { AutofocusDirective } from './directives/autofocus';
import { InstallPwaComponent } from './install-pwa/install-pwa.component';

/**
 * This module is shared only between the Auth and Content modules. It must NOT be imported into the CoreModule.
 */
@NgModule({
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCardModule,
  ],
  declarations: [AppHeaderComponent, InstallPwaComponent, AutofocusDirective],
  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatProgressBarModule,
    MatCardModule,
    AppHeaderComponent,
    AutofocusDirective,
  ],
})
export class SharedModule {}
