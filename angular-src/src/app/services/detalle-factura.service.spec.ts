import { TestBed, inject } from '@angular/core/testing';

import { DetalleFacturaService } from './detalle-factura.service';

describe('DetalleFacturaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DetalleFacturaService]
    });
  });

  it('should be created', inject([DetalleFacturaService], (service: DetalleFacturaService) => {
    expect(service).toBeTruthy();
  }));
});
