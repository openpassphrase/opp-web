import {
  ChangeDetectionStrategy, Component, EventEmitter, Input, Output,
  AfterViewInit, HostListener
} from '@angular/core';
import { Observable, of } from 'rxjs';

import * as versionFile from '../../../assets/version.json';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './app.header.component.html',
  styleUrls: ['./app.header.component.scss']
})
export class AppHeaderComponent implements AfterViewInit {
  @Input() loggedIn: Observable<boolean> | undefined;
  @Output() logout = new EventEmitter(false);

  version = 'Version: ' + (versionFile as any).version;

  ngAfterViewInit() {
    if (!this.loggedIn) {
      this.loggedIn = of(false);
    }
  }

  signOut() {
    this.logout.emit();
  }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (event.key === 'o' &&
      event.altKey &&
      event.ctrlKey) {
      this.signOut();
    }
  }
}
