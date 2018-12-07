import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerFacadePresenterComponent } from './logger-facade-presenter.component';

describe('LoggerFacadePresenterComponent', () => {
  let component: LoggerFacadePresenterComponent;
  let fixture: ComponentFixture<LoggerFacadePresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggerFacadePresenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggerFacadePresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
