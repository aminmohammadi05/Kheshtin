import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CompareComponent } from './compare.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: CompareComponent, pathMatch: 'full'  }
    ]),
    
  ]
})
export class CompareModule { }
