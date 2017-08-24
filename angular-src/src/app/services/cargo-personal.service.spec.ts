import { TestBed, inject } from '@angular/core/testing';

import { CargoPersonalService } from './cargo-personal.service';

describe('CargoPersonalService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CargoPersonalService]
    });
  });

  it('should be created', inject([CargoPersonalService], (service: CargoPersonalService) => {
    expect(service).toBeTruthy();
  }));
});
