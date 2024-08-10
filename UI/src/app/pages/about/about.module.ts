import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AboutComponent } from './about.component';



@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AboutComponent, pathMatch: 'full'  }
    ]),
    SharedModule
  ]
})
export class AboutModule { }
