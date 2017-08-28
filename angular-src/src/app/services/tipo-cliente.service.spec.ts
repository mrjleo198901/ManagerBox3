import { TestBed, inject } from '@angular/core/testing';

import { TipoClienteService } from './tipo-cliente.service';

describe('TipoClienteService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TipoClienteService]
    });
  });

  it('should be created', inject([TipoClienteService], (service: TipoClienteService) => {
    expect(service).toBeTruthy();
  }));
});
