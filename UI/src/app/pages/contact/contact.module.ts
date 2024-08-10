import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
// import { AgmCoreModule } from '@agm/core'; 
import { ContactComponent } from './contact.component';



@NgModule({
  declarations: [ContactComponent],
  imports: [
    CommonModule,
    RouterModule.forChild( [
      { path: '', component: ContactComponent, pathMatch: 'full'  }
    ]),
    SharedModule
  ]
})
export class ContactModule { }
