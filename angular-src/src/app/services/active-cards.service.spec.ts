import { TestBed, inject } from '@angular/core/testing';

import { ActiveCardsService } from './active-cards.service';

describe('ActiveCardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ActiveCardsService]
    });
  });

  it('should be created', inject([ActiveCardsService], (service: ActiveCardsService) => {
    expect(service).toBeTruthy();
  }));
});
