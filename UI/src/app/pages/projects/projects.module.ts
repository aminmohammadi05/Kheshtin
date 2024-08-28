import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { RouterModule } from '@angular/router';
import { ProjectDetailsComponent } from './project-details/project-details.component';



@NgModule({
  imports: [
    // CommonModule,
    // RouterModule.forChild([
    //   { path: ':page', component: ProjectsComponent, pathMatch: 'full' },
    //   { path: ':projectId/:urlTitle', component: ProjectDetailsComponent }
    // ]),
    // SharedModule
  ],
  declarations: [
   
  ]
})
export class ProjectsModule {
}
