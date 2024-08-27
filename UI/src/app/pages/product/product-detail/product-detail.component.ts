import { Component,
  OnInit,
  OnDestroy, ViewChild, ViewChildren, QueryList, HostListener, AfterViewInit, Inject, Input, ElementRef, Renderer2, ChangeDetectorRef, 
  CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { Property } from 'src/app/app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppService } from 'src/app/app.service';

import { CompareOverviewComponent } from 'src/app/shared/compare-overview/compare-overview.component';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { BrandService } from 'src/app/services/brand.service';
import { Observable, of } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { tap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { ProductKeyword } from 'src/app/models/product-keyword';
import * as uuid from 'uuid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BrandRequest } from 'src/app/models/request';
import { Search } from 'src/app/models/search';
import { OfficeProjectSearch } from 'src/app/models/office-project-search';
import { ProductFile } from 'src/app/models/product-file';
import { Usage } from 'src/app/models/usage';
import { ProductUsage } from 'src/app/models/product-usage';
import { OfficeProject } from 'src/app/models/office-project';
import { OfficeProjectService } from 'src/app/services/office-project.service';
import { EngineFrameService } from '../engine-frame.service';
import '@google/model-viewer/dist/model-viewer';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatChip, MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { BrandsCarouselComponent } from 'src/app/shared/brands-carousel/brands-carousel.component';
import { ProductItemComponent } from 'src/app/shared/product-item/product-item.component';
import { PropertiesSearchResultsFiltersComponent } from 'src/app/shared/properties-search-results-filters/properties-search-results-filters.component';
import { PropertiesSearchComponent } from 'src/app/shared/properties-search/properties-search.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import { FileTypePipe } from 'src/app/theme/pipes/file-type.pipe';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
export interface ProductImageData {
  product: Product;
  index: number;
}
export interface BrandDialogData {
  brand: Observable<Brand>;
  request: BrandRequest;
}



@Component({
  selector: 'app-brand-info-request-dialog',
  templateUrl: 'brand-info-request.html',
  styleUrls: ['./brand-info-request.css'],
  standalone: true,
  imports : [CommonModule, MatIconModule, ReactiveFormsModule, MatListModule, MatFormFieldModule, FlexLayoutModule, MatCardModule, MatDialogModule]
})
export class BrandInfoRequestDialogComponent implements OnInit {
  request: BrandRequest;
  @Input() variant = 1;
  reqform: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<BrandInfoRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BrandDialogData,
    public fb: FormBuilder) {
}
ngOnInit() {
  this.request = new BrandRequest({name: '' , email: '' , options: '' , request: ''});
  this.reqform = this.fb.group({
    categories: '',
    name: '',
    email: '',
    request: ''
  });

}
public getAppearance() {
  return (this.variant !== 3) ? 'outline' : '';
}
public getFloatLabel() {
  return (this.variant === 1) ? 'always' : '';
}
sendRequest() {
  this.request.name = this.reqform.get('name').value;
  this.request.email = this.reqform.get('email').value;
  this.request.requestText = this.reqform.get('request').value;
  this.request.options = this.reqform.get('categories').value.map(x => x).join(' ,');
  this.dialogRef.close({request: this.request});
}
}

@Component({
  selector: 'app-brand-contact-info-request-dialog',
  templateUrl: 'brand-contact-info-request.html',
  standalone: true,
  imports : [CommonModule, MatIconModule, FlexLayoutModule, MatCardModule, MatDialogModule]
})
export class BrandContactInfoRequestDialogComponent implements OnInit {
  brand: Observable<Brand>;
  @Input() variant = 1;
  reqform: FormGroup;
  constructor(
    public dialogRef: MatDialogRef<BrandContactInfoRequestDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: BrandDialogData,
    public fb: FormBuilder) {
      this.brand = data.brand;
}
ngOnInit() {
}
public getAppearance() {
  return (this.variant !== 3) ? 'outline' : '';
}
public getFloatLabel() {
  return (this.variant === 1) ? 'always' : '';
}

}


@Component({
  selector: 'app-product-image-view-dialog',
  templateUrl: 'product-image-view-dialog.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports : [CommonModule, MatIconModule, FlexLayoutModule, MatCardModule, MatDialogModule]
})
export class ProductImageViewDialogComponent implements OnInit {
  public settings: Settings;
  public selectedIndex = 1;
  public selectedImageId: number;
  product: any;
  @Input() variant = 1;
  reqform: FormGroup;
  constructor(public appSettings: AppSettings,
              public dialogRef: MatDialogRef<ProductImageViewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ProductImageData,
              public fb: FormBuilder) {
      this.settings = this.appSettings.createNew()
}
ngOnInit() {
  this.selectedImageId = 1;
  this.product = this.data.product;
  this.selectedIndex = this.data.index;

}
selectImage(index) {
  this.selectedIndex = index;
  let image = null;
  this.selectedImageId = this.product.productFile.contentItems[index].contentItemId;
}
public getAppearance() {
  return (this.variant !== 3) ? 'outline' : '';
}
public getFloatLabel() {
  return (this.variant === 1) ? 'always' : '';
}


}

@Component({
  selector: 'app-product-threed-image-view-dialog',
  templateUrl: 'product-threed-image-view-dialog.html',
  styleUrls: ['./product-detail.component.scss'],
  standalone: true,
  imports : [CommonModule,MatButtonModule, MatIconModule, FlexLayoutModule, MatCardModule, MatDialogModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductThreeDImageViewDialogComponent implements OnInit {
  // public config: SwiperConfigInterface = {};
  public settings: Settings;
  public selectedProductFile: any;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public selectedImageId: number;
  carouselProductFiles: any[];
  productFiles: any[];
  @Input() variant = 1;
  reqform: FormGroup;
  constructor(public appSettings: AppSettings,
              public authService: AuthService,
              public dialogRef: MatDialogRef<ProductThreeDImageViewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ThreeDModelData,
              public fb: FormBuilder,
              public productService: ProductsService) {
      this.settings = this.appSettings.createNew()
      const result = this.groupBy(this.data.productFiles, 'fileType')
        .filter(({ length }) => length > 0)
        .map(([v]) => v);
       
      this.carouselProductFiles = this.data.productFiles.filter(x => x.fileType.contentItems[0].id.split('-')[1] === result[0].fileType.contentItems[0].id.split('-')[1]);
      this.productFiles = this.data.productFiles;
}
ngOnInit() {
  // this.config = {
  //   observer: false,
  //   slidesPerView: 1,
  //   spaceBetween: 0,
  //   keyboard: true,
  //   navigation: true,
  //   pagination: false,
  //   grabCursor: true,
  //   loop: false,
  //   preloadImages: false,
  //   lazy: true
  // };

}

public onIndexChange(index: number) {
  this.selectedProductFile = this.productFiles[index];
  // this.swipers.forEach(swiper => {
  //   const elem = swiper['elementRef'].nativeElement;
  //   if (elem.id === 'small-carousel') {
  //     swiper.setIndex(index);
  //     for(let i = 0; i < elem.children[0].children.length; i++) {
  //       const element = elem.children[0].children[i];
  //       if (element.classList.contains('thumb-' + index)) {
  //         element.classList.add('active-thumb');
  //       } else {
  //         element.classList.remove('active-thumb');
  //       }
  //     }
  //   }
  // });
}
productFileExists(fileId: string, fileType: number) {
  return this.productFiles.filter(x => x.contentItemId === fileId && +x.fileType.contentItems[0].id.split('-')[1] === fileType)[0];
}
// selectImage(index) {
//   this.selectedIndex = index;
//   let image = null;
//   this.selectedImageId = this.product.productFiles[index].productFileId;
// }
public getAppearance() {
  return (this.variant !== 3) ? 'outline' : '';
}
public getFloatLabel() {
  return (this.variant === 1) ? 'always' : '';
}
save() {
  // this.dialogRef.close({action: 'save', selectedProduct: this.productFile});
}
close() {
  this.dialogRef.close({action: 'delete'});
}
public groupBy(array, key) {
  return array.reduce((accumulator, object) => {
      var temp = accumulator.find(array => array[0][key] === object[key]);
      if (temp) {
          temp.push(object);
      } else {
          accumulator.push([object])
      }
      return accumulator;
  }, []);
}
}

@Component({
  selector: 'app-product-texture-image-view-dialog',
  templateUrl: 'product-texture-image-view-dialog.html',
  standalone: true,
  imports : [CommonModule, MatButtonModule, MatIconModule, FlexLayoutModule, MatCardModule, MatDialogModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ProductTextureImageViewDialogComponent implements OnInit {
  // public config: SwiperConfigInterface = {};
  public settings: Settings;
  public selectedProductFile;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public selectedImageId: number;
  carouselProductFiles: any[];
  productFiles: any[];
  @Input() variant = 1;
  reqform: FormGroup;
  constructor(public appSettings: AppSettings,
              public authService: AuthService,
              public dialogRef: MatDialogRef<ProductTextureImageViewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: ThreeDModelData,
              public fb: FormBuilder,
              public productService: ProductsService) {
      this.settings = this.appSettings.createNew()
      let result = this.groupBy(this.data.productFiles, 'fileType')
        .filter(({ length }) => length > 0)
        .map(([v]) => v);
      
      this.carouselProductFiles = this.data.productFiles.filter(x => x.fileType === result[0].fileType);
      this.productFiles = this.data.productFiles;
}
ngOnInit() {
  // this.config = {
  //   observer: false,
  //   slidesPerView: 1,
  //   spaceBetween: 0,
  //   keyboard: true,
  //   navigation: true,
  //   pagination: false,
  //   grabCursor: true,
  //   loop: false,
  //   preloadImages: false,
  //   lazy: true
  // };

}

public groupBy(array, key) {
  return array.reduce((accumulator, object) => {
      var temp = accumulator.find(array => array[0][key] === object[key]);
      if (temp) {
          temp.push(object);
      } else {
          accumulator.push([object])
      }
      return accumulator;
  }, []);
}
productFileExists(fileId: number, fileType: number) {
  return this.productFiles.filter(x => x.productFileId === fileId && x.fileType === fileType)[0];
}
public onIndexChange(index: number) {
  this.selectedProductFile = this.productFiles[index];
  // this.swipers.forEach(swiper => {
  //   const elem = swiper['elementRef'].nativeElement;
  //   if (elem.id === 'small-carousel') {
  //     swiper.setIndex(index);
  //     for(let i = 0; i < elem.children[0].children.length; i++) {
  //       const element = elem.children[0].children[i];
  //       if (element.classList.contains('thumb-' + index)) {
  //         element.classList.add('active-thumb');
  //       } else {
  //         element.classList.remove('active-thumb');
  //       }
  //     }
  //   }
  // });
}
// selectImage(index) {
//   this.selectedIndex = index;
//   let image = null;
//   this.selectedImageId = this.product.productFiles[index].productFileId;
// }
public getAppearance() {
  return (this.variant !== 3) ? 'outline' : '';
}
public getFloatLabel() {
  return (this.variant === 1) ? 'always' : '';
}
save() {
  // this.dialogRef.close({action: 'save', selectedProduct: this.productFile});
}
close() {
  this.dialogRef.close({action: 'delete'});
}

}

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  providers: [EngineFrameService],
  standalone: true,
  imports : [CommonModule, MatIconModule, FlexLayoutModule, MatChipsModule, MatDividerModule, MatCardModule, MatSidenavModule,MatExpansionModule, BrandInfoRequestDialogComponent, BrandContactInfoRequestDialogComponent, ProductImageViewDialogComponent, ProductThreeDImageViewDialogComponent, ProductTextureImageViewDialogComponent, FileTypePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})

export class ProductDetailComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild('sidenav', { static: true }) sidenav: ElementRef;
  @ViewChild('stickyCard', { static: true }) stickyCard: ElementRef;
  @ViewChild('delimiter', { static: true }) delimiter: ElementRef;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  // @ViewChild('container', { static: true }) container: ElementRef;
  public sidenavOpen = true;
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  private sub: any;
  public product: any;
  public settings: Settings;
  public embedVideo: any;
  public relatedProducts: any[];
  public relatedOfficeProjects: any[];
  public featuredProducts: Product[];
  public brand: Observable<Brand>;
  public usages: Observable<Usage[]> = of([]);  
  public contactForm: FormGroup;
  public bottom = 0;
  public stlModelPath = '../../assets/Parrot.glb';
  public productSearchFields = new Search({
    searchId: 1,
    brandsBox: [],
    categoriesBoxNested: [],
    categoriesBox: [],
    fileTypes: [],
    searchBox: '',
    imageUploaded: '',
    vertical: true,
  });
  public projectSearchFields = new OfficeProjectSearch({
    searchId: 1,
    brandsBox: [],
    categoriesBoxNested: [],
    categoriesBox: [],
    fileTypes: [],
    searchBox: '',
    imageUploaded: '',
    vertical: true,
  });


  productId: string;
  productImage: string;
  threeDProductsFiles: any[] = [];
  textureProductsFiles: ProductFile[] = [];
  textureExists: Observable<boolean> = of(false);
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private activatedRoute: ActivatedRoute,
              private projectService: OfficeProjectService,
              
              private scene: EngineFrameService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private cdr: ChangeDetectorRef,
              public productService: ProductsService,
              private brandService: BrandService,
              public authService: AuthService,
              public infoReq: MatDialog,
              private meta: Meta) {
    this.settings = this.appSettings.createNew()
}

  ngOnInit() {
    
    this.sub = this.activatedRoute.params.subscribe(params => {     
      if (params.productId) {
        this.productId = params.productId;
        this.getProductById(this.productId);
      } else {
        this.router.navigate(['/**']);
      }
    });
    this.getFeaturedProducts();
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
      // this.sidenav.close();
    }
   
  }
  
  openZoom(event: any, show: boolean) {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  

  public getProductById(id) {
   this.productService.getProductById(id).subscribe(x => {
    this.product = x.product[0]
    this.getRelatedProducts()
    this.getRelatedOfficeProjects()
   });
  }

  ngAfterViewInit() {
    
    // this.config = {
    //   observer: false,
    //   slidesPerView: 1,
    //   spaceBetween: 0,
    //   keyboard: true,
    //   navigation: true,
    //   pagination: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false
    //   }
    // };

    // this.config2 = {
    //   observer: false,
    //   slidesPerView: 7,
    //   spaceBetween: 16,
    //   keyboard: true,
    //   navigation: false,
    //   pagination: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   breakpoints: {
    //     480: {
    //       slidesPerView: 2
    //     },
    //     600: {
    //       slidesPerView: 3,
    //     }
    //   }
    // };

  }


  public onOpenedChange() {
    // this.swipers.forEach(swiper => {
    //   if (swiper) {
    //     swiper.update();
    //   }
    // });
  }

  public selectImage(index: number) {
    // this.swipers.forEach(swiper => {
    //   if (swiper['elementRef'].nativeElement.id === 'main-carousel') {
    //     swiper.setIndex(index);
    //   }
    // });
  }

  public onIndexChange(index: number) {
    // this.swipers.forEach(swiper => {
    //   const elem = swiper['elementRef'].nativeElement;
    //   if (elem.id === 'small-carousel') {
    //     swiper.setIndex(index);
    //     for(let i = 0; i < elem.children[0].children.length; i++) {
    //       const element = elem.children[0].children[i];
    //       if (element.classList.contains('thumb-' + index)) {
    //         element.classList.add('active-thumb');
    //       } else {
    //         element.classList.remove('active-thumb');
    //       }
    //     }
    //   }
    // });
  }

  public addToCompare() {
    this.productService.addToCompare(this.product, CompareOverviewComponent, (this.settings.rtl) ? 'rtl' : 'ltr');
  }

  public onCompare() {
    return this.productService.Data.compareList.filter(item => item.productId === this.product.productId)[0];
  }

  public addToFavorites() {
    // this.store.pipe(select(getAllUserFavorites),
    // map((favorites) => {
    //   if (this.authService.loggedIn()) {
    //     if (!favorites.filter(item => item.productId === this.product.productId)[0]) {
    //       this.productService.addToFavorites(this.product, (this.settings.rtl) ? 'rtl' : 'ltr');
    //       this.store.dispatch(new UserLikeRequest(this.authService.getDecodedToken().nameid, this.product.productId));
    //     }
    //   } else {
    //     this.router.navigate(['/login']);
    //   }
    // })).subscribe();
  }



  public onFavorites() {
    // this.store.pipe(select(getAllUserFavorites),
    // map(favorites => {
    //   return favorites.filter(item => item.productId === this.product.productId)[0] === null ||
    //          favorites.filter(item => item.productId === this.product.productId)[0] === undefined;
    // }));
  }

  public checkTextureExists() {
    return this.product.productFiles.filter(x => x.fileType === 11).length > 0;
  }

  public getRelatedProducts() {
    
      this.productService.getRelatedProducts(`{from: 0, size: 10, fulltext:'${this.product.productCategory.contentItems.map(x => 'ProductCategory-' + x.id).join(' ')}'}`).subscribe(x => {
        
        this.relatedProducts = x.getProductsByCategoryIdProductDetail
      });
   
  }
  public getRelatedOfficeProjects() {
    
    this.projectService.getRelatedOfficeProjects(`{from: 0, size: 10, fulltext:'${this.product.productCategory.contentItems.map(x => 'ProductCategory-' + x.id).join(' ')}'}`).subscribe(x => {
        
      this.relatedOfficeProjects = x.getProductsByCategoryIdProductDetail
    });

  }

  public getFeaturedProducts() {
    if (this.authService.loggedIn()) {
      this.productService.getFeaturedProductsAuth(this.authService.getDecodedToken().nameid).subscribe(products => {
        this.featuredProducts = products.slice(0, 3);
      });
    } else {
      this.productService.getFeaturedProducts().subscribe(products => {
        this.featuredProducts = products.slice(0, 3);
      });
    }
  }

  public getBrand(brandId) {
    // this.brand = this.store.select(getBrandById(brandId));
  }
  public getProductUsage(): string{
    if (this.product) {
      return this.product.productUsage.contentItems.map(x => x.displayText).join(', ');
    } 
    return '';
  }

 

  tagClick(tag: ProductKeyword) {
    if (tag.action === 'getById') {
      this.router.navigate(['/' + tag.page + '/' + tag.value]);
    } else if (tag.action === 'search') {
      if (tag.page === 'products') {
        this.productSearchFields.searchBox = tag.value;
        // this.store.dispatch(new SaveSearchForRequest(this.productSearchFields));
      }
      if (tag.page === 'projects') {
        this.productSearchFields.searchBox = tag.value;
        // this.store.dispatch(new SaveSearchForRequest(this.productSearchFields));
      }
      this.router.navigate(['/' + tag.page], { queryParams: { filter: tag.value } });
    }
  }

  public getCategoriesNames() {
    if (this.product) {
      return this.product.productCategory.contentItems.map(x => x.displayText).join(', ')
    } 
    return '';
  }

  public openDataRequestDialog() {
    if (this.authService.loggedIn()) {
      const dialogRef = this.infoReq.open(BrandInfoRequestDialogComponent, {
        width: '800px',
        data: {brand: this.brand}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result && result.request) {
          this.brandService.sendDataRequest(this.authService.getDecodedToken().nameid, result.request).subscribe(x => {

          });
        } else {

        }

      });
    } else {
      this.router.navigate(['/login']);
    }

  }
  public openContactDialog() {
    const dialogRef = this.infoReq.open(BrandContactInfoRequestDialogComponent, {
      width: '20rem',
      data: {brand: this.brand}
    });
  }

  public openProductImageDialog(productFile: ProductFile, index: number) {
    const prodFiles = this.product.productFile.contentItems.filter(x => [2, 3].includes(+x.fileType.contentItems[0].id.split('-')[1]));
    this.infoReq.open(ProductTextureImageViewDialogComponent, {
      width: '900px',
      data: {
        productFiles: prodFiles,
        index: index
      }
    });

  }

  public openThreeDModelObjectDialog(productFile: ProductFile, index: number) {
    const prodFiles = this.product.productFile.contentItems.filter(x => [4, 5, 6, 13].includes(+x.fileType.contentItems[0].id.split('-')[1]));
    this.infoReq.open(ProductThreeDImageViewDialogComponent, {
      width: '900px',
      data: {
        productFiles: prodFiles,
        index: index
      }
    });

  }
  public groupBy(array, key) {
    return array.reduce((accumulator, object) => {
        var temp = accumulator.find(array => array[0][key] === object[key]);
        if (temp) {
            temp.push(object);
        } else {
            accumulator.push([object])
        }
        return accumulator;
    }, []);
  }
  public openTextureShowRoom() {
    if (this.authService.loggedIn()) {
      this.brand.subscribe(b => {
        if (b) {
          this.router.navigate(['/textureshowroom', b.brandId, this.productId]);
        }
      });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
export interface ThreeDModelData {
  productFiles: any[];
  index: number;
}
