import {
  AfterViewInit,
  ChangeDetectorRef,
  Directive,
  ElementRef,
  HostListener,
  Input,
  inject,
} from '@angular/core';
import { MatInput } from '@angular/material/input';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[autofocus]',
  standalone: true,
})
export class AutofocusDirective implements AfterViewInit {
  private el = inject(ElementRef);
  private _cd = inject(ChangeDetectorRef);
  private matInput = inject(MatInput, { optional: true });

  private _autofocus = true;

  @Input() set autofocus(condition: boolean | '') {
    this._autofocus = condition !== false;
  }

  @Input() focusOnKey: string | undefined;

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
