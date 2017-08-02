import { TestBed, inject } from '@angular/core/testing';

import { TipoProductoService } from './tipo-producto.service';

describe('TipoProductoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoProductoService]
    });
  });

  it('should be created', inject([TipoProductoService], (service: TipoProductoService) => {
    expect(service).toBeTruthy();
  }));
});
