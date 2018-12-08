import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageFacadePresenterComponent } from './storage-facade-presenter.component';

describe('StorageFacadePresenterComponent', () => {
  let component: StorageFacadePresenterComponent;
  let fixture: ComponentFixture<StorageFacadePresenterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageFacadePresenterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageFacadePresenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
