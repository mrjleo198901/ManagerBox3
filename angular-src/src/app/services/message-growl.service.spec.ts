import { TestBed, inject } from '@angular/core/testing';

import { MessageGrowlService } from './message-growl.service';

describe('MessageGrowlService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MessageGrowlService]
    });
  });

  it('should be created', inject([MessageGrowlService], (service: MessageGrowlService) => {
    expect(service).toBeTruthy();
  }));
});
