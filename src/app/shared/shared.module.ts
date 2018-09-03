import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';

import {
  MatInputModule, MatToolbarModule, MatSnackBarModule, MatButtonModule,
  MatTooltipModule, MatSelectModule, MatProgressBarModule, MatDialogModule,
  MatIconModule, MatCheckboxModule, MatExpansionModule, MatCardModule
} from '@angular/material';

import { AppHeaderComponent } from '@app/shared/app-header/app.header.component';
import { AutofocusDirective } from '@app/shared/directives/autofocus';
import { HighlightPipe } from '@app/shared/directives/highlightPipe';
import { CapitalizePipe } from '@app/shared/directives/capitalizePipe';
import { InstallPwaComponent } from '@app/shared/install-pwa/install-pwa.component';
import { UpdateAvailableComponent } from '@app/shared/update-available/update-available.component';


export const ANGULAR_MATERIAL_MODULES = [
  MatInputModule, MatToolbarModule, MatSnackBarModule, MatButtonModule,
  MatTooltipModule, MatSelectModule, MatProgressBarModule, MatDialogModule,
  MatIconModule, MatCheckboxModule, MatExpansionModule, MatCardModule
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
    InstallPwaComponent,
    UpdateAvailableComponent,
    AutofocusDirective,
    HighlightPipe,
    CapitalizePipe
  ],
  declarations: [
    AppHeaderComponent,
    InstallPwaComponent,
    UpdateAvailableComponent,
    AutofocusDirective,
    HighlightPipe,
    CapitalizePipe
  ],
  entryComponents: [
    UpdateAvailableComponent
  ]
})
export class SharedModule { }
