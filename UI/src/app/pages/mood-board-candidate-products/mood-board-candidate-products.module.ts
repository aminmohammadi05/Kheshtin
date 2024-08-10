import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MoodBoardCandidateProductsComponent } from './mood-board-candidate-products.component';



@NgModule({
  declarations: [MoodBoardCandidateProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: MoodBoardCandidateProductsComponent, pathMatch: 'full'  }
    ]),
    SharedModule
  ]
})
export class MoodBoardCandidateProductsModule { }
