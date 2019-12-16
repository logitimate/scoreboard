import { TestBed } from '@angular/core/testing';

import { BowlService } from './bowl.service';

describe('BowlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BowlService = TestBed.get(BowlService);
    expect(service).toBeTruthy();
  });
});
