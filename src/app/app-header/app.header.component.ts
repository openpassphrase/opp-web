import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnInit, AfterViewInit, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/debounceTime';


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

  ngOnInit() {
    this.secretPhrase = new FormControl('', [Validators.required, Validators.minLength(6)]);
    this.secretPhrase.valueChanges
      .debounceTime(500)
      .subscribe((newValue) => {
        if (this.secretPhrase.valid) {
          this.secretPhraseChange.emit(newValue);
        }
      });
  }

  ngAfterViewInit() {
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
}
