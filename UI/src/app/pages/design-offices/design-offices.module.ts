import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesignOfficesComponent } from './design-offices.component';
import { DesignOfficeDetailComponent } from './design-office-detail/design-office-detail.component';
import { RouterModule } from '@angular/router';

import { OfficeProjectsComponent } from '../office-projects/office-projects.component';
import { DesignOfficeVideosComponent } from './design-office-videos/design-office-videos.component';
import { DesignOfficeProjectsComponent } from './design-office-projects/design-office-projects.component';


@NgModule({
  imports: [
    // CommonModule,
    // PaginationModule,
    // RouterModule.forChild([
    //   { path: ':page', component: DesignOfficesComponent, pathMatch: 'full' },
    //   { path: ':designOfficeId/:tab/:page/:urlTitle', component: DesignOfficeDetailComponent }
    // ])
    
  ],
  declarations: [
  ]
})
export class DesignOfficesModule { }
