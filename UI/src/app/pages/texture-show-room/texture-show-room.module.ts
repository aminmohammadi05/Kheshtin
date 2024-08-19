import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TextureShowRoomComponent, TextureShowRoomDownloadDialogComponent } from './texture-show-room.component';



@NgModule({

  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TextureShowRoomComponent, pathMatch: 'full' },
      { path: ':brandId/:productId', component: TextureShowRoomComponent },
      { path: ':brandId', component: TextureShowRoomComponent }
    ])
    
  ]
})
export class TextureShowRoomModule {
}
