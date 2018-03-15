import { TestBed, inject } from '@angular/core/testing';

import { MateriaPrimaService } from './materia-prima.service';

describe('MateriaPrimaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MateriaPrimaService]
    });
  });

  it('should be created', inject([MateriaPrimaService], (service: MateriaPrimaService) => {
    expect(service).toBeTruthy();
  }));
});
