import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  Optional
} from '@angular/core';
import { MatInput } from '@angular/material/input';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[autofocus]',
})
export class AutofocusDirective implements AfterViewInit {
  private _autofocus = true;

  @Input() set autofocus(condition: boolean | '') {
    this._autofocus = condition !== false;
  }

  @Input() focusOnKey: string | undefined;

  constructor(
    private el: ElementRef,
    private _cd: ChangeDetectorRef,
    @Optional() private matInput?: MatInput
  ) {}

  ngAfterViewInit() {
    if (this._autofocus) {
      this.focus();
    }
  }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (
      this.focusOnKey !== undefined &&
      event.key === this.focusOnKey &&
      event.altKey &&
      event.ctrlKey
    ) {
      this.focus();
    }
  }

  private focus() {
    if (this.matInput) {
      this.matInput.focus();
    } else {
      this.el.nativeElement.focus();
    }
    this._cd.detectChanges();
  }
}
