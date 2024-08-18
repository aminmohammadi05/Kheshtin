import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { MoodBoardComponent } from './mood-board.component';
import { GridsterModule } from 'angular-gridster2';
import { MoodBoardDetailComponent } from './mood-board-detail/mood-board-detail.component';



@NgModule({
  declarations: [
    MoodBoardComponent,
    MoodBoardDetailComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: MoodBoardComponent, pathMatch: 'full' },
      { path: ':moodBoardId/:urlTitle', component: MoodBoardDetailComponent },
      
    ]),
    SharedModule
  ]
})
export class MoodBoardModule {
}
