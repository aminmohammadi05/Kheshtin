/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RefreshTokenInterceptorService } from './refresh-token-interceptor.service';

describe('Service: RefreshTokenInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RefreshTokenInterceptorService]
    });
  });

  it('should ...', inject([RefreshTokenInterceptorService], (service: RefreshTokenInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
