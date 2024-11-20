import { Injectable } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SwUpdate } from '@angular/service-worker';
import { PwaService } from '../../core/pwa.service';
import { InstallPwaComponent } from './install-pwa.component';

@Injectable()
class PwaServiceMock extends PwaService {
  showIosCustomButton = true;
}

describe('InstallPwaComponent', () => {
  let component: InstallPwaComponent;
  let fixture: ComponentFixture<InstallPwaComponent>;
  let button: (className: string) => HTMLElement;

  function expectButtonToBeShown(className: string) {
    const btn = button(className);
    expect(btn).not.toBeNull();
    expect(btn.tagName).toBe('BUTTON');
  }

  function expectButtonToBeHidden(className: string) {
    expect(button(className)).toBeNull();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InstallPwaComponent],
      providers: [
        { provide: PwaService, useClass: PwaServiceMock },
        { provide: SwUpdate, useValue: {} },
        { provide: MatSnackBar, useValue: {} },
      ],
    });
    fixture = TestBed.createComponent(InstallPwaComponent);
    component = fixture.componentInstance;
    button = (className: string) =>
      fixture.nativeElement.querySelector(`button.${className}`);
  });

  it('should instantiate', () => {
    expect(component).toBeDefined();
  });

  it('should initially not show button', () => {
    fixture.detectChanges();
    expectButtonToBeHidden('js-button');
  });

  it('should not show button if app is installed', () => {
    triggerDocEvent('appinstalled');
    fixture.detectChanges();
    expectButtonToBeHidden('js-button');
  });

  it('should show button after beforeinstallprompt event', () => {
    triggerDocEvent('beforeinstallprompt');
    fixture.detectChanges();
    expectButtonToBeShown('js-button');
  });

  it('should hide button after app installation', () => {
    triggerDocEvent('beforeinstallprompt');
    fixture.detectChanges();
    triggerDocEvent('appinstalled');
    fixture.detectChanges();
    expectButtonToBeHidden('js-button');
  });

  it('should show ios button', () => {
    fixture.detectChanges();
    expectButtonToBeShown('js-ios-button');
  });
});

function triggerDocEvent(eventType: string, evtObj?: any) {
  const evt = new Event(eventType, evtObj);
  window.dispatchEvent(evt);
}
