import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandsComponent } from './brands.component';
import { BrandDetailComponent } from './brand-detail/brand-detail.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { BrandDetailSearchComponent } from 'src/app/shared/brand-detail-search/brand-detail-search.component';
import { BrandCollectionsComponent } from 'src/app/shared/brand-collections/brand-collections.component';
import { BrandCatalogItemComponent } from 'src/app/shared/brand-catalog-item/brand-catalog-item.component';
import { BrandCollectionItemComponent } from 'src/app/shared/brand-collection-item/brand-collection-item.component';
import { BrandVideoItemComponent } from 'src/app/shared/brand-video-item/brand-video-item.component';
import { BrandResellerItemComponent } from 'src/app/shared/brand-reseller-item/brand-reseller-item.component';
import { CollectionsComponent } from './collections/collections.component';
import { CatalogsComponent } from './catalogs/catalogs.component';
import { ResellersComponent } from './resellers/resellers.component';
import { VideosComponent } from './videos/videos.component';
import { BrandProjectsComponent } from './brand-projects/brand-projects.component';
import { BrandProductsComponent } from './brand-products/brand-products.component';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';


@NgModule({
  imports: [
    CommonModule,
    PaginationModule,
    RouterModule.forChild([
      { path: ':page', component: BrandsComponent, pathMatch: 'full' },
      { path: ':brandId/:tab/:page/:urlTitle', component: BrandDetailComponent }
    ]),
    SharedModule
  ],
  declarations: [
    BrandsComponent,
    BrandDetailComponent,
    BrandDetailSearchComponent,
    BrandCollectionsComponent,
    BrandCatalogItemComponent,
    BrandCollectionItemComponent,
    BrandVideoItemComponent,
    BrandResellerItemComponent,
    BrandProjectsComponent,
    BrandProductsComponent,
    CollectionsComponent,
    CatalogsComponent,
    ResellersComponent,
    VideosComponent
  ]
})
export class BrandsModule { }
