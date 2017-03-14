import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer, HostListener } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';

var versionFile = require('../../../assets/version.json')

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-header',
  templateUrl: './app.header.component.html',
  styleUrls: ['./app.header.component.scss']
})

export class AppHeaderComponent implements OnInit, AfterViewInit {
  @Input() loggedIn: Observable<boolean>;
  @Output() logout = new EventEmitter(false);
  @Output() secretPhraseChange = new EventEmitter(false);

  @ViewChild('secretInput') secretInput: ElementRef;

  constructor(private renderer: Renderer) { }

  secretPhrase: FormControl;
  version: String;

  ngOnInit() {
    this.version = 'Version: ' + versionFile.version;
    this.secretPhrase = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.secretPhrase.valueChanges
      .debounceTime(500)
      .subscribe((newValue) => {
        this.secretPhraseChange.emit(this.secretPhrase.valid ? newValue : undefined);
      });
  }

  ngAfterViewInit() {
    if (!this.loggedIn) {
      this.loggedIn = Observable.of(false);
    }
    this.loggedIn.subscribe((isLoggedIn) => {
      if (isLoggedIn) {
        if (this.secretInput) {
          this.renderer.invokeElementMethod(this.secretInput.nativeElement, 'focus');
        }
      } else {
        this.secretPhrase.setValue('');
        this.secretPhrase.markAsPristine();
      }
    });
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
