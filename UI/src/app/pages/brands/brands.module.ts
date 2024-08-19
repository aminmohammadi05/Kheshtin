import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsComponent } from './brands.component';
import { BrandDetailComponent } from './brand-detail/brand-detail.component';
import { RouterModule } from '@angular/router';
import { PaginationModule } from 'ngx-bootstrap/pagination';


@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    RouterModule.forChild([
      { path: ':page', component: BrandsComponent, pathMatch: 'full' },
      { path: ':brandId/:tab/:page/:urlTitle', component: BrandDetailComponent }
    ]),
    
  ],
  declarations: [
  ]
})
export class BrandsModule { }
