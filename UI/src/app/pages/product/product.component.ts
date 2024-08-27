import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FlexLayoutModule, MediaChange, MediaObserver } from '@angular/flex-layout';
 import {  } from 'ngx-scrollbar';
import { Observable, fromEvent, merge, Subscription, of, combineLatest, zip, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { ProductsDataSource } from 'src/app/services/products-data-source';
import { CategoryService } from 'src/app/services/category.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap, skip, switchMap, map, filter, withLatestFrom, flatMap, first, take, mergeMap } from 'rxjs/operators';
import { PaginatedResult, Pagination } from 'src/app/models/pagination';

import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { Category } from 'src/app/models/category';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { PageImages } from 'src/app/models/page-images';
import { InitializeService } from 'src/app/services/initialize.service';
import { Search } from 'src/app/models/search';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { BrandProductCollection } from 'src/app/models/brand-product-collection';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrandsCarouselComponent } from 'src/app/shared/brands-carousel/brands-carousel.component';
import { PropertiesSearchResultsFiltersComponent } from 'src/app/shared/properties-search-results-filters/properties-search-results-filters.component';

import { MatChipsModule } from '@angular/material/chips';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { PropertiesSearchComponent } from 'src/app/shared/properties-search/properties-search.component';
import { ProductItemComponent } from 'src/app/shared/product-item/product-item.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports : [CommonModule, MatIconModule, FlexLayoutModule, MatCardModule, MatSidenavModule, BrandsCarouselComponent, MatChipsModule, PropertiesSearchResultsFiltersComponent, PaginationComponent, PropertiesSearchComponent, ProductItemComponent]
})
export class ProductComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public categoriesBS : BehaviorSubject<Category[]> = new BehaviorSubject([]);
  public psConfig = {
    wheelPropagation: true
  };
  public allProducts: any[] = [];
  public products: any[] = [];
 
  public slides: PageImages[];
  public totalProducts: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public searchFields = new Search({
    searchId: 1,
    brandsBox: [],
    categoriesBoxNested: [],
    brandCollectionBox: [],
    imageUploaded: '',
    fileTypes: [],
    searchBox: '',
    vertical: true,
    pageQuery: new Pagination(0, 12, null, null)
  });
  public removedSearchField: string;
  public isLoading = false;
  public message: string;
  public watcher: Subscription;


  public settings: Settings;
  private sub: any;
  categoryId: number;
  dataSource: ProductsDataSource;
  searchTerm = 'filter=';
  displayedColumns = ['blogId', 'blogTitle'];
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              public initializeService: InitializeService,
              private authService: AuthService,
              public mediaObserver: MediaObserver,
              private route: ActivatedRoute,
              private router: Router,
              public basicDataService: BasicDataService, 
              private productService: ProductsService,
              private brandService: BrandService,
              private cdRef: ChangeDetectorRef) {
    this.settings = this.appSettings.createNew()


}

  ngOnInit() {
    this.isLoading = true;
    combineLatest([this.categoriesBS.asObservable(), this.route.params]).subscribe((x: any) => {      
      if (x[0].length > 0 &&
         (
          (x[1]["search"] && x[1]["search"].toString() !== 'null')|| 
          (x[1]["brands"] && x[1]["brands"].toString() !== 'null') ||
          (x[1]["collections"] && x[1]["collections"].toString() !== 'null')|| 
          (x[1]["categories"] && x[1]["categories"].toString() !== 'null'))) {
        this.getProducts(x[0],+x[1]["page"],x[1]["search"],x[1]["brands"],x[1]["collections"], x[1]["categories"]);
      } else if(x[1]["search"] && x[1]["search"].toString() === 'null' &&
       x[1]["brands"] && x[1]["brands"].toString() === 'null' &&
       x[1]["collections"] && x[1]["collections"].toString() === 'null' &&
       x[1]["categories"] && x[1]["categories"].toString() === 'null') {
        this.router.navigate(['/products', this.searchFields.pageQuery.currentPage + 1]);

      }
      else if (+x[1]["page"] && !x[1]["search"] && !x[1]["brands"]  && !x[1]["collections"]  && !x[1]["categories"] ){        
        this.productService.getAllProducts(this.searchFields.pageQuery.itemsPerPage, this.searchFields.pageQuery.itemsPerPage * (+x[1]["page"] - 1)).subscribe((x:any) => {
          this.searchFields.pageQuery.totalItems = x[0].items[0].ProductCount;
          this.message = x[0].items[0].ProductCount === 0 ? "موردی یافت نشد" : '';
          this.products = x[1].product
          this.isLoading = false;
        });
      }
    })

   

    // this.getSlides();
  }

  ngAfterViewInit() {

  }

  public getSlides() {
    if (this.authService.loggedIn()) {
      this.initializeService.getPageImagesAuth(this.authService.getDecodedToken().nameid, 2).subscribe(x => {
        this.slides = x;
      });
    } else {
      this.initializeService.getPageImages(2).subscribe(x => {
        this.slides = x;
      });
    }
  }

  public getProducts(cats, currentPage, search, brands, collections, categories) {
    
    this.searchFields = new Search({
      searchId: 1,
    brandsBox: [],
    categoriesBoxNested: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter(x => {
      if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
        return x;
      }
    }) : [],
    categoriesBox: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter(x => {
      if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
        return x;
      }
    }) : [],
    brandCollectionBox: [],
    pageQuery: new Pagination(currentPage - 1, this.count, null, null)
    })
    this.productService.getProducts(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''} ${brands ? brands.replace('null', '').split('_').join(' ') : ''} ${ collections ? collections.replace('null', '').split('_').join(' ') : ''} ${categories ? categories.replace('null', '').split('_').map(x => 'ProductCategory_'+x).join(' ') : ''}'}`).subscribe((x:any) => {
      this.searchFields.pageQuery.totalItems = x[0].count
      this.message = x[0].count === 0 ? "موردی یافت نشد" : '';
      this.products = x[1].searchProducts;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    
  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.searchFields = new Search({
        searchId: 1,
        pageQuery: new Pagination(0, this.count, null, null)
      });
    }
  }

 

  public searchClicked() {
    window.scrollTo(0, 0);
  }
  public ReadyForDispatch(value) {
    this.searchFields = new Search({
      searchId: 1,
      brandsBox: value.brandsBox &&
      value.brandsBox.length > 0 ? value.brandsBox : [],
      brandCollectionBox: value.brandCollectionBox &&
         value.brandCollectionBox.length > 0 ? value.brandCollectionBox : [],
      categoriesBoxNested: value.categoriesBoxNested &&
         value.categoriesBoxNested.length > 0 ? value.categoriesBoxNested : [],
      categoriesBox: value.categoriesBox &&
         value.categoriesBox.length > 0 ? value.categoriesBox : [],
      imageUploaded: value.imageToSearch &&
      value.imageToSearch.length > 0 ? value.imageToSearch[0].preview : '',
      fileTypes: value.fileTypes &&
      value.fileTypes.length > 0 ? value.fileTypes : [],
      searchBox: value.searchBox &&
      value.searchBox.length > 0 ? value.searchBox : '',
      pageQuery: new Pagination(0, this.count, null, null)
    });
    // this.store.dispatch(new ResetProductsRequest());
    // this.store.dispatch(new SaveSearchForRequest(this.searchFields));
  }
  public searchChanged(event) {
    
    if (event ) {
      this.resetPagination();
      this.ReadyForDispatch(event.value);
      setTimeout(() => {
          this.removedSearchField = null;
        });
      if (!this.settings.searchOnBtnClick) {
          this.products.length = 0;
        }
      if (!this.settings.searchOnBtnClick) {
        this.router.navigate(['/products', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', brands: this.searchFields.brandsBox.length > 0 ? this.searchFields.brandsBox.map(x => x.brandId).join('_'): 'null', collections:this.searchFields.brandCollectionBox.length > 0 ? this.searchFields.brandCollectionBox.map(x => x.brandCollectionId).join('_') : 'null', categories: this.searchFields.categoriesBoxNested.length > 0 ? this.searchFields.categoriesBoxNested.map(x => x.categoryId).join('_') : 'null'}]);
          
        }
    }
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }


  public changeCount(count) {
    this.count = count;
    this.resetPagination();
    // this.getProducts();

  }
  public changeSorting(sort) {
    this.sort = sort;
    // this.getProducts();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }

  public PageChange(event) {
    this.searchFields = new Search({
      searchId: 1,
      pageQuery: new Pagination(event.pageIndex, event.pageSize, event.length, null)
    });
    // this.store.dispatch(new SaveSearchForRequest(this.searchFields));
  }

}
