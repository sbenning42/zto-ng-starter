import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoggerFacadeContainerComponent } from './logger-facade-container.component';

describe('LoggerFacadeContainerComponent', () => {
  let component: LoggerFacadeContainerComponent;
  let fixture: ComponentFixture<LoggerFacadeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoggerFacadeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoggerFacadeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
