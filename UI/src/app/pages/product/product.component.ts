import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { , MediaChange, MediaObserver } from '@angular/flex-layout';
 import {  } from 'ngx-scrollbar';
import { Observable, fromEvent, merge, Subscription, of, combineLatest, zip, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap, skip, switchMap, map, filter, withLatestFrom, flatMap, first, take, mergeMap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AppSettings, Settings } from '../../app.settings';
import { Category } from '../../models/category';
import { PageImages } from '../../models/page-images';
import { Pagination } from '../../models/pagination';
import { Search } from '../../models/search';
import { AuthService } from '../../services/auth.service';
import { BasicDataService } from '../../services/basic-data.service';
import { BrandService } from '../../services/brand.service';
import { InitializeService } from '../../services/initialize.service';
import { ProductsDataSource } from '../../services/products-data-source';
import { ProductsService } from '../../services/products.service';
import { BrandsCarouselComponent } from '../../shared/brands-carousel/brands-carousel.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';
import { ProductItemComponent } from '../../shared/product-item/product-item.component';
import { PropertiesSearchResultsFiltersComponent } from '../../shared/properties-search-results-filters/properties-search-results-filters.component';
import { PropertiesSearchComponent } from '../../shared/properties-search/properties-search.component';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css'],
  standalone: true,
  imports : [CommonModule, MatIconModule, MatCardModule, MatSidenavModule, BrandsCarouselComponent, MatChipsModule, PropertiesSearchResultsFiltersComponent, PaginationComponent, PropertiesSearchComponent, ProductItemComponent]
})
export class ProductComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  public categoriesBS!: BehaviorSubject<Category[]>;
  public psConfig = {
    wheelPropagation: true
  };
  public allProducts: any[] = [];
  public products: any[] = [];
 
  public slides!: PageImages[];
  public totalProducts!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public searchFields = new Search({
    searchId: 1,
    brandsBox: [],
    categoriesBoxNested: [],
    brandCollectionBox: [],
    imageUploaded: '',
    fileTypes: [],
    searchBox: '',
    vertical: true,
    pageQuery: new Pagination(0, 12, 0, 0)
  });
  public removedSearchField!: string;
  public isLoading = false;
  public message!: string;
  public watcher!: Subscription;


  public settings: Settings;
  private sub: any;
  categoryId!: number;
  dataSource!: ProductsDataSource;
  searchTerm = 'filter=';
  displayedColumns = ['blogId', 'blogTitle'];
  public appSettings= inject( AppSettings);
              public initializeService= inject( InitializeService);
              private authService= inject( AuthService);
              public mediaObserver= inject( MediaObserver);
              private route= inject( ActivatedRoute);
              private router= inject( Router);
              public basicDataService= inject( BasicDataService); 
              private productService= inject( ProductsService);
              private brandService= inject( BrandService);
              private cdRef= inject( ChangeDetectorRef);
  constructor() {
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

  public getProducts(cats: any[], currentPage: number, search: string, brands: string, collections: string, categories: { replace: (arg0: string, arg1: string) => { (): any; new(): any; split: { (arg0: string): { (): any; new(): any; length: number; includes: { (arg0: any): any; new(): any; }; map: { (arg0: (x: any) => string): any[]; new(): any; }; }; new(): any; }; }; }) {
    
    this.searchFields = new Search({
      searchId: 1,
    brandsBox: [],
    categoriesBoxNested: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter((x: { categoryId: { toString: () => any; }; }) => {
      if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
        return x;
      }
    }) : [],
    categoriesBox: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter((x: { categoryId: { toString: () => any; }; }) => {
      if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
        return x;
      }
    }) : [],
    brandCollectionBox: [],
    pageQuery: new Pagination(currentPage - 1, this.count, 0, 0)
    })
    this.productService.getProducts(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''} ${brands ? brands.replace('null', '').split('_').join(' ') : ''} ${ collections ? collections.replace('null', '').split('_').join(' ') : ''} ${categories ? categories.replace('null', '').split('_').map((x: string) => 'ProductCategory_'+x).join(' ') : ''}'}`).subscribe((x:any) => {
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
        pageQuery: new Pagination(0, this.count, 0, 0)
      });
    }
  }

 

  public searchClicked() {
    window.scrollTo(0, 0);
  }
  public ReadyForDispatch(value: { brandsBox: string | any[]; brandCollectionBox: string | any[]; categoriesBoxNested: string | any[]; categoriesBox: string | any[]; imageToSearch: string | any[]; fileTypes: string | any[]; searchBox: string | any[]; }) {
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
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
    // this.store.dispatch(new ResetProductsRequest());
    // this.store.dispatch(new SaveSearchForRequest(this.searchFields));
  }
  public searchChanged(event: { value: any; }) {
    
    if (event ) {
      this.resetPagination();
      this.ReadyForDispatch(event.value);
      setTimeout(() => {
          this.removedSearchField = '';
        });
      if (!this.settings.searchOnBtnClick) {
          this.products.length = 0;
        }
      if (!this.settings.searchOnBtnClick) {
        this.router.navigate(['/products', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', brands: this.searchFields.brandsBox.length > 0 ? this.searchFields.brandsBox.map(x => x.brandId).join('_'): 'null', collections:this.searchFields.brandCollectionBox.length > 0 ? this.searchFields.brandCollectionBox.map(x => x.brandCollectionId).join('_') : 'null', categories: this.searchFields.categoriesBoxNested.length > 0 ? this.searchFields.categoriesBoxNested.map(x => x.categoryId).join('_') : 'null'}]);
          
        }
    }
  }
  public removeSearchField(field: string) {
    this.message = '';
    this.removedSearchField = field;
  }


  public changeCount(count: number) {
    this.count = count;
    this.resetPagination();
    // this.getProducts();

  }
  public changeSorting(sort: string) {
    this.sort = sort;
    // this.getProducts();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }

  public PageChange(event: { pageIndex: number; pageSize: number; length: number; }) {
    this.searchFields = new Search({
      searchId: 1,
      pageQuery: new Pagination(event.pageIndex, event.pageSize, event.length, 0)
    });
    // this.store.dispatch(new SaveSearchForRequest(this.searchFields));
  }

}
