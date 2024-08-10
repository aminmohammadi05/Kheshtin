import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { CompareComponent } from './compare.component';



@NgModule({
  declarations: [CompareComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CompareComponent, pathMatch: 'full'  }
    ]),
    SharedModule
  ]
})
export class CompareModule { }
