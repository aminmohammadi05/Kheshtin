import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { SafeHtmlPipe } from 'src/app/theme/pipes/safe-html.pipe';
import { FileTypePipe } from 'src/app/theme/pipes/file-type.pipe';
import { FileValueAccessorDirective } from 'src/app/theme/directives/file-value-accessor.directive';
import { FileValidatorDirective } from 'src/app/theme/directives/file-validator.directive';
import { ProjectsSearchComponent } from 'src/app/shared/projects-search/projects-search.component';
import { OfficeProjectsComponent } from './office-projects.component';
import { OfficeProjectDetailsComponent,
  OfficeProjectImageViewDialogComponent } from './office-project-details/office-project-details.component';
import { OfficeProject } from 'src/app/models/office-project';
import { OfficeProjectHeaderCarouselComponent } from 'src/app/shared/office-project-header-carousel/office-project-header-carousel.component';



@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: ':page', component: OfficeProjectsComponent, pathMatch: 'full' },
      { path: ':projectId/:urlTitle', component: OfficeProjectDetailsComponent }
    ]),
    SharedModule
  ],
  entryComponents:[
    OfficeProjectImageViewDialogComponent
  ],
  declarations: [
    OfficeProjectDetailsComponent,
    OfficeProjectImageViewDialogComponent,
    OfficeProjectHeaderCarouselComponent,
  ]
})
export class OfficeProjectsModule {
}
