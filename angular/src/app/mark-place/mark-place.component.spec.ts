import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkPlaceComponent } from './mark-place.component';

describe('MarkPlaceComponent', () => {
  let component: MarkPlaceComponent;
  let fixture: ComponentFixture<MarkPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
