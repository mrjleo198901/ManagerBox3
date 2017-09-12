import { TestBed, inject } from '@angular/core/testing';

import { InventarioService } from './inventario.service';

describe('InventarioService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InventarioService]
    });
  });

  it('should be created', inject([InventarioService], (service: InventarioService) => {
    expect(service).toBeTruthy();
  }));
});
