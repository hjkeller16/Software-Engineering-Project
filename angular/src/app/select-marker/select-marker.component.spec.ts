import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectMarkerComponent } from './select-marker.component';

describe('SelectMarkerComponent', () => {
  let component: SelectMarkerComponent;
  let fixture: ComponentFixture<SelectMarkerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectMarkerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectMarkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
