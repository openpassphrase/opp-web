import { animate, state, style, transition, trigger } from '@angular/animations';
import { DOCUMENT } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ContentChild, ElementRef, EventEmitter, HostBinding, HostListener, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { CdkExpIconActionDirective } from './exp-icon-action.directive';
import { CdkExpIconCloseDirective } from './exp-icon-close.directive';
import { CdkExpIconOpenDirective } from './exp-icon-open.directive';
import { CdkExpInputDirective } from './exp-input.directive';
import { InputsManagerService } from './inputs-manager.service';

export class ExpInputError extends Error {
  constructor(message: string) {
    super(`Error in cdk-expandable-input: ${message}`);
  }
}

@Component({
  selector: 'cdk-expandable-input',
  template: `
    <div class="wrap-all">
      <span class="input-field" [style.height.px]="dims.cdkExpInput.h">
        <span class="input-field_wrapper" [@slideInOut]="isOpen">
          <ng-content select="[cdkExpInput]"></ng-content>
        </span>
      </span>

      <span
        class="icons"
        [class.icons--active]="isOpen"
        [style.height.px]="dims.icons.h"
        [style.width.px]="dims.icons.w"
      >
        <span class="icons_icon-action"
          *ngIf="iconAction"
          [style.right.px]="dims.icons.w + actionOffset"
          [style.height.px]="dims.iconAction.h"
          [style.visibility]="isOpen ? 'visible' : 'hidden'"
        >
          <ng-content select="[cdkExpIconAction]"></ng-content>
        </span>

        <span class="icons_icon-close"
          (click)="close()"
          [style.height.px]="dims.iconClose.h"
        >
          <ng-content select="[cdkExpIconClose]"></ng-content>
        </span>

        <span
          class="icons_icon-open"
          (click)="open()"
          [style.height.px]="dims.iconOpen.h"
          #iconSearchWrapper>
          <ng-content select="[cdkExpIconOpen]"></ng-content>
        </span>
      </span>
    </div>
  `,
  styleUrls: ['./expandable-input.component.scss'],
  host: {
    '[style.position]': 'isAbsolute ? "absolute" : undefined',
    '[style.zIndex]': 'isAbsolute && isOpen ? 3 : undefined',
    '[@slideHostLeft]': 'isAbsolute && isOpen'
  },
  animations: [
    trigger('slideInOut', [
      state('true', style({ left: '0' })),
      state('false', style({ left: '100%' })),
      transition('true => false', animate('300ms ease-in')),
      transition('false => true', animate('300ms ease-out'))
    ]),
    trigger('slideHostLeft', [
      state('true', style({ left: '0' })),
      state('false', style({ left: '*' })),
      transition('true => false', animate('100ms ease-in')),
      transition('false => true', animate('300ms ease-out'))
    ])
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CdkExpandableInputComponent implements OnInit, AfterViewInit, OnDestroy {
  private inputHtmlEl: HTMLInputElement | undefined | null;

  /**
   * If multiple components use the same value for "group" input, only one
   * component with that group value can be expanded at a time
   */
  @Input() group: string | undefined;

  @Input() isAbsolute = false;

  /**
   * Set [right] when using [isAbsolute]=true to control
   * how far from the right edge the the component is positioned
   */
  @HostBinding('style.right.px')
  @Input() right = 0;
  private _rightInitial: number;

  /**
   * Used when [isAbsolute]=true && [right] > 0.
   * Animates component to take the whole container's width when extending
   */
  @Input() slideToEdge = false;

  /**
   * Sets how far to the left from the open/close elements the action element is.
   */
  @Input() actionOffset = 5;

  /**
   * When true, input looses focus if Esc is pressed
   */
  @Input() blurInputOnEsc = false;

  /**
   * When set to KeyboardEvent.key, input will expand when that key is pressed
   */
  @Input() openOnKey: string | undefined;

  @Output() opened = new EventEmitter();
  @Output() closed = new EventEmitter();

  isOpen = false;
  dims: IDims = {
    cdkExpInput: { w: 0, h: 0 },
    icons: { w: 0, h: 0 },
    iconOpen: { w: 0, h: 0 },
    iconClose: { w: 0, h: 0 },
    iconAction: { w: 0, h: 0 },
  };

  /**
   * Example usage:
   * <cdk-expandable-input>
   *   <input cdkExpInput />
   * </cdk-expandable-input>
   */
  @ContentChild(CdkExpInputDirective, { read: ElementRef })
  expandableInputRef: ElementRef;
  expandableInput: HTMLElement;

  /**
   * Example usage:
   * <cdk-expandable-input>
   *   <i cdkExpIconOpen>search</i>
   * </cdk-expandable-input>
   */
  @ContentChild(CdkExpIconOpenDirective, { read: ElementRef })
  iconOpen: ElementRef;

  /**
   * Example usage:
   * <cdk-expandable-input>
   *   <i cdkExpIconClose>close</i>
   * </cdk-expandable-input>
   */
  @ContentChild(CdkExpIconCloseDirective, { read: ElementRef })
  iconClose: ElementRef;

  /**
   * Example usage:
   * <cdk-expandable-input>
   *   <button cdkExpIconAction mat-mini-fab>
   *     <mat-icon>add</mat-icon>
   *   </button>
   * </cdk-expandable-input>
   */
  @ContentChild(CdkExpIconActionDirective, { read: ElementRef })
  iconAction: ElementRef;

  @ViewChild('iconSearchWrapper') iconSearchWrapper: ElementRef;

  @HostListener('document:keyup.escape')
  onEsc() {
    this.blurOnInput();
  }

  @HostListener('document:keydown', ['$event'])
  keydown(ev: KeyboardEvent) {
    if (this.openOnKey !== undefined &&
      ev.key === this.openOnKey &&
      (!this.isOpen || !this.isInputFocused())
    ) {
      ev.preventDefault();
      this.open();
    }
  }

  constructor(
    private inputsManager: InputsManagerService,
    private hostElRef: ElementRef,
    private cdr: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: any
  ) { }

  ngOnInit() {
    this.inputsManager.registerComponent(this);
    this._rightInitial = this.right;
  }

  ngAfterViewInit() {
    this.sanityCheck();
    this.checkNoBackground();
    this.setElementsSpacing();
    if (this.expandableInput) {
      this.inputHtmlEl = this.expandableInput.querySelector('input');
    }
  }

  ngOnDestroy() {
    this.inputsManager.deregisterComponent(this);
  }

  open() {
    if (this.slideToEdge) {
      this.right = 0;
    }
    this.isOpen = true;
    this.opened.emit();
    this.focusOnInput();
    this.inputsManager.onOpen(this);
  }

  close() {
    if (this.slideToEdge) {
      this.right = this._rightInitial;
    }
    this.isOpen = false;
    this.closed.emit();
    this.cdr.detectChanges();
  }

  private setElementsSpacing() {
    const iconOpen: HTMLElement = this.iconOpen.nativeElement;
    const iconClose: HTMLElement = this.iconClose.nativeElement;
    if (this.iconAction) {
      const iconAction: HTMLElement = this.iconAction.nativeElement;
      this.dims.iconAction.w = iconAction.offsetWidth;
      this.dims.iconAction.h = iconAction.offsetHeight;
    }
    if (iconOpen.offsetWidth && iconOpen.offsetHeight) {
      this.dims.iconOpen.w = iconOpen.offsetWidth;
      this.dims.iconOpen.h = iconOpen.offsetHeight;
      this.dims.iconClose.w = iconClose.offsetWidth;
      this.dims.iconClose.h = iconClose.offsetHeight;
      this.dims.icons.w = Math.max(this.dims.iconOpen.w, this.dims.iconClose.w);
      this.dims.icons.h = Math.max(this.dims.iconOpen.h, this.dims.iconClose.h, this.dims.iconAction.h);
      this.expandableInput = this.expandableInputRef.nativeElement;
      this.dims.cdkExpInput.h = this.expandableInput.offsetHeight;
      this.cdr.detectChanges();
    } else {
      this.waitForExpandableInputToShow().then(() => {
        this.setElementsSpacing();
      });
    }
  }

  /**
   * In case the host is not visible on page load, the reported dimentions
   * won't be correct. Ensure to setElementsSpacing() after host is visible.
   */
  private waitForExpandableInputToShow() {
    return new Promise(resolve => {
      const options = {
        root: this.document.documentElement
      };

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.intersectionRatio > 0) {
            observer.disconnect();
            resolve();
          }
        });
      }, options);

      observer.observe(this.hostElRef.nativeElement);
    });
  }

  private focusOnInput() {
    if (this.inputHtmlEl) {
      this.inputHtmlEl.focus();
    }
  }

  private blurOnInput() {
    if (this.blurInputOnEsc) {
      // input might have other keyup.escape handler associated with it
      // setTimeout to push blur call at the end of the event loop
      setTimeout(() => {
        if (this.inputHtmlEl) {
          this.inputHtmlEl.blur();
        }
      });
    }
  }

  private isInputFocused() {
    if (!this.inputHtmlEl || !this.document.activeElement) {
      return false;
    }
    return this.inputHtmlEl === this.document.activeElement;
  }

  private sanityCheck() {
    if (!this.expandableInputRef) {
      throw new ExpInputError('You need to include an element with attribute cdkExpInput');
    }

    if (!this.iconOpen) {
      throw new ExpInputError('You need to include an element with attribute cdkExpIconOpen');
    }

    if (!this.iconClose) {
      throw new ExpInputError('You need to include an element with attribute cdkExpIconClose');
    }
  }

  private checkNoBackground() {
    const bg = window.getComputedStyle(this.hostElRef.nativeElement).getPropertyValue('background-color');
    const none = 'rgba(0, 0, 0, 0)';
    if (!bg || bg === none || bg === 'transparent') {
      const message = `Absolutely positioned cdk-expandable-input does not have a solid background-color.
      This might result in other elements showing through when component is expanded.`;
      console.warn(message);
    }
  }
}

export interface IWidthheight {
  w: number;
  h: number;
}

export interface IDims {
  cdkExpInput: IWidthheight;
  icons: IWidthheight;
  iconOpen: IWidthheight;
  iconClose: IWidthheight;
  iconAction: IWidthheight;
}
