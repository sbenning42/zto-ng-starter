import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToastFacadePresenterComponent } from './toast-facade-presenter.component';

describe('ToastFacadePresenterComponent', () => {
  let component: ToastFacadePresenterComponent;
  let fixture: ComponentFixture<ToastFacadePresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToastFacadePresenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToastFacadePresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
