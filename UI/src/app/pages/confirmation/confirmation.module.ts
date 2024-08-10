import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ConfirmationComponent } from './confirmation.component';



@NgModule({
  declarations: [ConfirmationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ConfirmationComponent, pathMatch: 'full'  }
    ]),
    SharedModule
  ]
})
export class ConfirmationModule { }
