import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShowHidePasswordComponent {
  @Input() password: string;
  @Output() copied = new EventEmitter<void>();

  private readonly isPasswordShownSubj = new BehaviorSubject<boolean>(false);
  isPasswordShown$ = this.isPasswordShownSubj.asObservable();
  iconName$ = this.isPasswordShown$.pipe(
    map((isShown) => (isShown ? 'visibility_off' : 'visibility'))
  );

  toggleVisibility() {
    const isVisible = this.isPasswordShownSubj.getValue();
    this.isPasswordShownSubj.next(!isVisible);
  }
}
