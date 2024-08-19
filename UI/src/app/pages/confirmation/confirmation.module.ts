import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ConfirmationComponent } from './confirmation.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ConfirmationComponent, pathMatch: 'full'  }
    ]),
    
  ]
})
export class ConfirmationModule { }
