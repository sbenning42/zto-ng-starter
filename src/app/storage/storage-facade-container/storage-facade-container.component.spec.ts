import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StorageFacadeContainerComponent } from './storage-facade-container.component';

describe('StorageFacadeContainerComponent', () => {
  let component: StorageFacadeContainerComponent;
  let fixture: ComponentFixture<StorageFacadeContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StorageFacadeContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StorageFacadeContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
