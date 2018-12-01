import { TestBed } from '@angular/core/testing';

import { CommentRepositoryService } from './comment-repository.service';

describe('CommentRepositoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CommentRepositoryService = TestBed.get(CommentRepositoryService);
    expect(service).toBeTruthy();
  });
});
