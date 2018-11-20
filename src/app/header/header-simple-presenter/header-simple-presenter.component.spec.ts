import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderSimplePresenterComponent } from './header-simple-presenter.component';

describe('HeaderSimplePresenterComponent', () => {
  let component: HeaderSimplePresenterComponent;
  let fixture: ComponentFixture<HeaderSimplePresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HeaderSimplePresenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderSimplePresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
