import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectsComponent } from './projects.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { SafeHtmlPipe } from 'src/app/theme/pipes/safe-html.pipe';
import { FileTypePipe } from 'src/app/theme/pipes/file-type.pipe';
import { FileValueAccessorDirective } from 'src/app/theme/directives/file-value-accessor.directive';
import { FileValidatorDirective } from 'src/app/theme/directives/file-validator.directive';
import { ProjectsSearchComponent } from 'src/app/shared/projects-search/projects-search.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: ':page', component: ProjectsComponent, pathMatch: 'full' },
      { path: ':projectId/:urlTitle', component: ProjectDetailsComponent }
    ]),
    SharedModule
  ],
  declarations: [
    ProjectsComponent,
    ProjectDetailsComponent
  ]
})
export class ProjectsModule {
}
