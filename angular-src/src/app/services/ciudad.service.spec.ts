import { TestBed, inject } from '@angular/core/testing';

import { CiudadService } from './ciudad.service';

describe('CiudadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CiudadService]
    });
  });

  it('should be created', inject([CiudadService], (service: CiudadService) => {
    expect(service).toBeTruthy();
  }));
});
