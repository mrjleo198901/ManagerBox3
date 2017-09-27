import { TestBed, inject } from '@angular/core/testing';

import { PromocionService } from './promocion.service';

describe('PromocionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PromocionService]
    });
  });

  it('should be created', inject([PromocionService], (service: PromocionService) => {
    expect(service).toBeTruthy();
  }));
});
