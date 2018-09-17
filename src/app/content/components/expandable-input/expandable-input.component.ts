import { ChangeDetectionStrategy, Component, ContentChild, Input, OnInit, ViewChild } from '@angular/core';
import { MatFormField, MatFormFieldControl } from '@angular/material';

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

  isOpen = false;

  @ContentChild(MatFormFieldControl) _control: MatFormFieldControl<any>;
  @ViewChild(MatFormField) _matFormField: MatFormField;

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
