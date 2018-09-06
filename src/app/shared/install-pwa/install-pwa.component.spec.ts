import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material';
import { SwUpdate } from '@angular/service-worker';
import { PwaService } from '@app/core/pwa.service';

import { InstallPwaComponent } from './install-pwa.component';

describe('InstallPwaComponent', () => {
  let component: InstallPwaComponent;
  let fixture: ComponentFixture<InstallPwaComponent>;
  let button: () => HTMLElement;

  function expectButtonToBeShown() {
    const btn = button();
    expect(btn).not.toBeNull();
    expect(btn.tagName).toBe('BUTTON');
  }

  function expectButtonToBeHidden() {
    expect(button()).toBeNull();
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstallPwaComponent],
      providers: [
        PwaService,
        { provide: SwUpdate, useValue: {} },
        { provide: MatSnackBar, useValue: {} }
      ]
    });
    fixture = TestBed.createComponent(InstallPwaComponent);
    component = fixture.componentInstance;
    button = () => fixture.nativeElement.querySelector('button');
  });

  it('should instantiate', () => {
    expect(component).toBeDefined();
  });

  it('should initially not show button', () => {
    fixture.detectChanges();
    expectButtonToBeHidden();
  });

  it('should not show button if app is installed', () => {
    triggerDocEvent('appinstalled');
    fixture.detectChanges();
    expectButtonToBeHidden();
  });

  it('should show button after beforeinstallprompt event', () => {
    triggerDocEvent('beforeinstallprompt');
    fixture.detectChanges();
    expectButtonToBeShown();
  });

  it('should hide button after app installation', () => {
    triggerDocEvent('beforeinstallprompt');
    fixture.detectChanges();
    triggerDocEvent('appinstalled');
    fixture.detectChanges();
    expectButtonToBeHidden();
  });
});

function triggerDocEvent(eventType: string, evtObj?: any) {
  const evt = new Event(eventType, evtObj);
  window.dispatchEvent(evt);
}
