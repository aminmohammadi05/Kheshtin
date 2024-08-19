import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OfficeProjectsComponent } from './office-projects.component';
import { OfficeProjectDetailsComponent } from './office-project-details/office-project-details.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: ':page', component: OfficeProjectsComponent, pathMatch: 'full' },
      { path: ':projectId/:urlTitle', component: OfficeProjectDetailsComponent }
    ])
    
  ],
  declarations: [
   
  ]
})
export class OfficeProjectsModule {
}
