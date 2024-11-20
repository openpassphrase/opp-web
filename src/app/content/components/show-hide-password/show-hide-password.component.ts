import { AsyncPipe, NgIf } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ClipboardModule } from 'ngx-clipboard';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-show-hide-password',
  templateUrl: './show-hide-password.component.html',
  styleUrls: ['./show-hide-password.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    NgIf,
    ClipboardModule,
    MatTooltip,
    MatIconButton,
    MatIcon,
    AsyncPipe,
  ],
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
