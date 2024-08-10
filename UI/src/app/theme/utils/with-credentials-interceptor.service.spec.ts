/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WithCredentialsInterceptorService } from './with-credentials-interceptor.service';

describe('Service: WithCredentialsInterceptor', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WithCredentialsInterceptorService]
    });
  });

  it('should ...', inject([WithCredentialsInterceptorService], (service: WithCredentialsInterceptorService) => {
    expect(service).toBeTruthy();
  }));
});
