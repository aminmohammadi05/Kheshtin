import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { FaqComponent } from './faq.component';



@NgModule({
  declarations: [FaqComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: FaqComponent, pathMatch: 'full'  }
    ]),
    SharedModule
  ]
})
export class FaqModule { }
