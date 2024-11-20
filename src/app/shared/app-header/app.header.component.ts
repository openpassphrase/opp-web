import { AsyncPipe, NgIf } from '@angular/common';
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
} from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatToolbar } from '@angular/material/toolbar';
import { Observable, of } from 'rxjs';
import { version } from '../../../assets/version';
import { InstallPwaComponent } from '../install-pwa/install-pwa.component';

@Component({
  selector: 'app-header',
  templateUrl: './app.header.component.html',
  styleUrls: ['./app.header.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatToolbar, InstallPwaComponent, NgIf, MatButton, AsyncPipe],
})
export class AppHeaderComponent implements AfterViewInit {
  @Input() loggedIn: Observable<boolean> | undefined;
  @Output() logout = new EventEmitter();

  version = 'Version: ' + version;

  ngAfterViewInit() {
    if (!this.loggedIn) {
      this.loggedIn = of(false);
    }
  }

  signOut() {
    this.logout.emit({});
  }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event.key === 'o' && event.altKey && event.ctrlKey) {
      this.signOut();
    }
  }
}
