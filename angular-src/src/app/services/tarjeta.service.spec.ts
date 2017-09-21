import { TestBed, inject } from '@angular/core/testing';

import { TarjetaService } from './tarjeta.service';

describe('TarjetaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TarjetaService]
    });
  });

  it('should be created', inject([TarjetaService], (service: TarjetaService) => {
    expect(service).toBeTruthy();
  }));
});
