/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AddCsrfHeaderInterceptorService } from './add-csrf-header-interceptor.service';

describe('Service: AddCsrfHeaderInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddCsrfHeaderInterceptorService]
    });
  });

  it('should ...', inject([AddCsrfHeaderInterceptorService], (service: AddCsrfHeaderInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
