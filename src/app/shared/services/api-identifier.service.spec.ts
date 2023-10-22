import { TestBed } from '@angular/core/testing';

import { ApiIdentifierService } from './api-identifier.service';

describe('ApiIdentifierService', () => {
  let service: ApiIdentifierService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiIdentifierService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
