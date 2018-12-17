import { TestBed } from '@angular/core/testing';

import { MockLocationService } from './mock-location.service';

describe('MockLocationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MockLocationService = TestBed.get(MockLocationService);
    expect(service).toBeTruthy();
  });
});
