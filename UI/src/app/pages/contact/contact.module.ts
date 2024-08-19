import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
// import { AgmCoreModule } from '@agm/core'; 
import { ContactComponent } from './contact.component';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild( [
      { path: '', component: ContactComponent, pathMatch: 'full'  }
    ]),
    
  ]
})
export class ContactModule { }
