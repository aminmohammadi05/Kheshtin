import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LandingComponent } from './landing.component'; 
 


@NgModule({
  declarations: [LandingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: LandingComponent, pathMatch: 'full'  }
    ]),
    SharedModule,
  ]
})
export class LandingModule { }
