import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TextureShowRoomComponent, TextureShowRoomDownloadDialogComponent } from './texture-show-room.component';



@NgModule({
  declarations: [
    TextureShowRoomComponent,
    TextureShowRoomDownloadDialogComponent

  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: TextureShowRoomComponent, pathMatch: 'full' },
      { path: ':brandId/:productId', component: TextureShowRoomComponent },
      { path: ':brandId', component: TextureShowRoomComponent }
    ]),
    SharedModule
  ]
})
export class TextureShowRoomModule {
}
