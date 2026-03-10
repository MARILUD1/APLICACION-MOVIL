import { TestBed } from '@angular/core/testing';

import { CleanheroesApi } from './cleanheroes-api';

describe('CleanheroesApi', () => {
  let service: CleanheroesApi;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CleanheroesApi);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
