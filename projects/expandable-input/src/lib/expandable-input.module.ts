import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CdkExpIconActionDirective } from './exp-icon-action.directive';
import { CdkExpIconCloseDirective } from './exp-icon-close.directive';
import { CdkExpIconOpenDirective } from './exp-icon-open.directive';
import { CdkExpInputDirective } from './exp-input.directive';
import { CdkExpandableInputComponent } from './expandable-input.component';
import { InputsManagerService } from './inputs-manager.service';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CdkExpandableInputComponent,
    CdkExpInputDirective,
    CdkExpIconOpenDirective,
    CdkExpIconCloseDirective,
    CdkExpIconActionDirective
  ],
  providers: [
    InputsManagerService
  ],
  exports: [
    CdkExpandableInputComponent,
    CdkExpInputDirective,
    CdkExpIconOpenDirective,
    CdkExpIconCloseDirective,
    CdkExpIconActionDirective
  ]
})
export class ExpandableInputModule { }
