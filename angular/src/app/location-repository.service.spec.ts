import { TestBed } from '@angular/core/testing';

import { LocationRepositoryService } from './location-repository.service';

describe('LocationRepositoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocationRepositoryService = TestBed.get(LocationRepositoryService);
    expect(service).toBeTruthy();
  });
});
