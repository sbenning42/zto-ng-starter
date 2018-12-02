import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastFacadeContainerComponent } from './toast-facade-container.component';

describe('ToastFacadeContainerComponent', () => {
  let component: ToastFacadeContainerComponent;
  let fixture: ComponentFixture<ToastFacadeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastFacadeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastFacadeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
