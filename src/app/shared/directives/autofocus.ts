import { AfterViewInit, ChangeDetectorRef, Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  // tslint:disable-next-line:directive-selector
  selector: '[autofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  private _autofocus = true;

  @Input() set autofocus(condition: boolean) {
    this._autofocus = condition !== false;
  }

  @Input() focusOnKey: string | undefined;

  constructor(
    private el: ElementRef,
    private _cd: ChangeDetectorRef
  ) { }

  ngAfterViewInit() {
    if (this._autofocus) {
      this.focus();
    }
  }

  @HostListener('document:keydown', ['$event'])
  keyboardInput(event: KeyboardEvent) {
    if (this.focusOnKey !== undefined &&
      event.key === this.focusOnKey &&
      event.altKey &&
      event.ctrlKey) {
      this.focus();
    }
  }

  private focus() {
    this.el.nativeElement.focus();
    this._cd.detectChanges();
  }
}
