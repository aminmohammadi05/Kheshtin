import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProductComponent } from './product.component';
import { BrandContactInfoRequestDialogComponent,
  BrandInfoRequestDialogComponent, ProductDetailComponent,
  ProductImageViewDialogComponent,
  ProductTextureImageViewDialogComponent,
  ProductThreeDImageViewDialogComponent} from './product-detail/product-detail.component';
import { MatDialogModule } from '@angular/material/dialog';




@NgModule({
  declarations: [
    

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    // MatDialogModule,
    // CommonModule,
    // PaginationModule,
    // RouterModule.forChild([
    //   { path: ':page', component: ProductComponent, pathMatch: 'full' },
    //   { path: ':productId/:urlTitle', component: ProductDetailComponent }
    // ])
    
  ]
})
export class ProductsModule {
}
