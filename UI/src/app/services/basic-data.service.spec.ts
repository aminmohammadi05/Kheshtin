/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BasicDataService } from './basic-data.service';

describe('Service: BasicData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BasicDataService]
    });
  });

  it('should ...', inject([BasicDataService], (service: BasicDataService) => {
    expect(service).toBeTruthy();
  }));
});
