import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CdkExpandableInputComponent } from './expandable-input.component';


describe('ExpandableInputComponent', () => {
  let component: CdkExpandableInputComponent;
  let fixture: ComponentFixture<CdkExpandableInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CdkExpandableInputComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CdkExpandableInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
