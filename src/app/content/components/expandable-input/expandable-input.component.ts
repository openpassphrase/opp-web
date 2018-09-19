import { ChangeDetectionStrategy, Component, ContentChild, Directive, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material';
import { CdkExpandableInputComponent } from 'expandable-input';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[expIconClose]'
})
export class ExpIconCloseDirective { }

@Component({
  selector: 'app-expandable-input',
  templateUrl: './expandable-input.component.html',
  styleUrls: ['./expandable-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpandableInputComponent implements OnInit {
  @Input() group: string | undefined;
  @Input() isAbsolute = false;
  @Input() right = 0;
  @Input() slideToEdge = false;
  @Input() openOnKey: string | undefined;

  isOpen = false;

  @ViewChild(CdkExpandableInputComponent) cdk: CdkExpandableInputComponent;

  @ContentChild(MatFormFieldControl) _control: MatFormFieldControl<any>;
  @ViewChild(MatFormField) _matFormField: MatFormField;

  @ContentChild(ExpIconCloseDirective, { read: ElementRef }) iconClose: ElementRef;

  ngOnInit() {
    this._matFormField._control = this._control;
  }

  opened() {
    this.isOpen = true;
  }

  closed() {
    this.isOpen = false;
  }
}
