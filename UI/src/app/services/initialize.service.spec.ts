/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { InitializeService } from './initialize.service';

describe('Service: Initialize', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [InitializeService]
    });
  });

  it('should ...', inject([InitializeService], (service: InitializeService) => {
    expect(service).toBeTruthy();
  }));
});
