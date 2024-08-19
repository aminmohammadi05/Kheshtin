import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MoodBoardCandidateProductsComponent } from './mood-board-candidate-products.component';



@NgModule({
  declarations: [MoodBoardCandidateProductsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: MoodBoardCandidateProductsComponent, pathMatch: 'full'  }
    ])
    
  ]
})
export class MoodBoardCandidateProductsModule { }
