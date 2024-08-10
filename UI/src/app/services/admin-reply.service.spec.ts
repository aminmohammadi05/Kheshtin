/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AdminReplyService } from './admin-reply.service';

describe('Service: AdminReply', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AdminReplyService]
    });
  });

  it('should ...', inject([AdminReplyService], (service: AdminReplyService) => {
    expect(service).toBeTruthy();
  }));
});
