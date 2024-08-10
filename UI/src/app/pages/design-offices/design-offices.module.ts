import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignOfficesComponent } from './design-offices.component';
import { DesignOfficeDetailComponent } from './design-office-detail/design-office-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { DesignOfficesSearchComponent } from 'src/app/shared/design-offices-search/design-offices-search.component';

import { OfficeProjectsComponent } from '../office-projects/office-projects.component';
import { DesignOfficeItemComponent } from 'src/app/shared/design-office-item/design-office-item.component';
import { DesignOfficeDetailSearchComponent } from 'src/app/shared/design-office-detail-search/design-office-detail-search.component';
import { OfficeProjectItemComponent } from 'src/app/shared/office-project-item/office-project-item.component';
import { DesignOfficeVideosComponent } from './design-office-videos/design-office-videos.component';
import { DesignOfficeVideoItemComponent } from 'src/app/shared/design-office-video-item/design-office-video-item.component';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';
import { DesignOfficeProjectsComponent } from './design-office-projects/design-office-projects.component';


@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    RouterModule.forChild([
      { path: ':page', component: DesignOfficesComponent, pathMatch: 'full' },
      { path: ':designOfficeId/:tab/:page/:urlTitle', component: DesignOfficeDetailComponent }
    ]),
    SharedModule
  ],
  declarations: [
    DesignOfficesComponent,
    DesignOfficeDetailComponent,
    DesignOfficeDetailSearchComponent,
    DesignOfficeVideosComponent,
    DesignOfficeVideoItemComponent,
    DesignOfficeProjectsComponent
    // DesignOfficesCarouselComponent,
  ]
})
export class DesignOfficesModule { }
