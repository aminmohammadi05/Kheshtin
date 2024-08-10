import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { ProductComponent } from './product.component';
import { BrandContactInfoRequestDialogComponent,
  BrandInfoRequestDialogComponent, ProductDetailComponent,
  ProductImageViewDialogComponent,
  ProductTextureImageViewDialogComponent,
  ProductThreeDImageViewDialogComponent} from './product-detail/product-detail.component';
import { SafeHtmlPipe } from 'src/app/theme/pipes/safe-html.pipe';
import { FileTypePipe } from 'src/app/theme/pipes/file-type.pipe';
import { FileValueAccessorDirective } from 'src/app/theme/directives/file-value-accessor.directive';
import { FileValidatorDirective } from 'src/app/theme/directives/file-validator.directive';
import { MatDialogModule } from '@angular/material/dialog';
import { ProductTexturesHeaderCarouselComponent } from 'src/app/shared/product-textures-header-carousel/product-textures-header-carousel.component';
import { PaginationModule,PaginationConfig } from 'ngx-bootstrap/pagination';




@NgModule({
  declarations: [
    ProductComponent,
    ProductDetailComponent,
    BrandInfoRequestDialogComponent,
    BrandContactInfoRequestDialogComponent,
    ProductTexturesHeaderCarouselComponent,
    ProductImageViewDialogComponent,
    ProductThreeDImageViewDialogComponent,
    ProductTextureImageViewDialogComponent

  ],
  entryComponents: [
    BrandInfoRequestDialogComponent,
    BrandContactInfoRequestDialogComponent,
    ProductImageViewDialogComponent,
    ProductThreeDImageViewDialogComponent,
    ProductTextureImageViewDialogComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    MatDialogModule,
    CommonModule,
    PaginationModule,
    RouterModule.forChild([
      { path: ':page', component: ProductComponent, pathMatch: 'full' },
      { path: ':productId/:urlTitle', component: ProductDetailComponent }
    ]),
    SharedModule
  ]
})
export class ProductsModule {
}
