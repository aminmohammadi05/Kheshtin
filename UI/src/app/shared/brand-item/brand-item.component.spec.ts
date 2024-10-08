/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BrandItemComponent } from './brand-item.component';

describe('BrandItemComponent', () => {
  let component: BrandItemComponent;
  let fixture: ComponentFixture<BrandItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrandItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
