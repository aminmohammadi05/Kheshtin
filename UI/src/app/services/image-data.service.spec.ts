/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ImageDataService } from './image-data.service';

describe('Service: ImageData', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ImageDataService]
    });
  });

  it('should ...', inject([ImageDataService], (service: ImageDataService) => {
    expect(service).toBeTruthy();
  }));
});
