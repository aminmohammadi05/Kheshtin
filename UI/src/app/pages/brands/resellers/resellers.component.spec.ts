/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { ResellersComponent } from './resellers.component';

describe('ResellersComponent', () => {
  let component: ResellersComponent;
  let fixture: ComponentFixture<ResellersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResellersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResellersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
