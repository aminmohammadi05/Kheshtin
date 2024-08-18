import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DesignMoodBoardComponent, MoodBoardProductDetailDialogComponent } from './design-mood-board.component';
import { GridsterModule } from 'angular-gridster2';
import { MoodBoardProductsCarouselComponent } from 'src/app/shared/mood-board-products-carousel/mood-board-products-carousel.component';
import { TileLayersComponent } from './tile-layers/tile-layers.component';
import { MoodBoardExtraInfoComponent } from './mood-board-extra-info-dialog.component';
// import { MoodBoardToolboxComponent } from './mood-board-toolbox/mood-board-toolbox.component';



@NgModule({
  declarations: [
    DesignMoodBoardComponent,
    MoodBoardProductDetailDialogComponent,
    MoodBoardProductsCarouselComponent,
    TileLayersComponent,
    MoodBoardExtraInfoComponent,
    // MoodBoardToolboxComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: DesignMoodBoardComponent, pathMatch: 'full' },
      { path: ':moodBoardId', component: DesignMoodBoardComponent, pathMatch: 'full' }
    ]),
    SharedModule,
    GridsterModule
  ]
})
export class DesignMoodBoardModule {
}
