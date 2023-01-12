import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import {
  ExpandableInputBase,
  ExpandableInputComponent,
} from '@ngspot/expandable-input';
import {
  iconCloseAnimation,
  iconOpenAnimation,
} from './expandable-input.animations';

@Component({
  selector: 'app-expandable-input',
  templateUrl: './expandable-input.component.html',
  styleUrls: ['./expandable-input.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppExpandableInputComponent extends ExpandableInputBase {
  override iconOpenAnimation = iconOpenAnimation;
  override iconCloseAnimation = iconCloseAnimation;

  @ViewChild(ExpandableInputComponent, { static: true })
  expandableInput: ExpandableInputComponent;

  get isOpen() {
    return this.expandableInput?.isOpen;
  }
}
