import {
  Directive, ElementRef, Renderer, Input, AfterViewInit,
  ChangeDetectorRef, HostListener
} from '@angular/core';

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
    private renderer: Renderer,
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
    this.renderer.invokeElementMethod(this.el.nativeElement, 'focus');
    this._cd.detectChanges();
  }
}
