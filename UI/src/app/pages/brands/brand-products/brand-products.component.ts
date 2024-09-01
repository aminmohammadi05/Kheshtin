import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input, 
  inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription, combineLatest } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';

import { AppSettings, Settings } from '../../../app.settings';
import { Brand } from '../../../models/brand';
import { BrandProductSearch } from '../../../models/brand-product-search';
import { Category } from '../../../models/category';
import { Pagination } from '../../../models/pagination';
import { Search } from '../../../models/search';
import { AuthService } from '../../../services/auth.service';
import { ProductsService } from '../../../services/products.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { ProductItemComponent } from '../../../shared/product-item/product-item.component';
import { PropertiesSearchResultsFiltersComponent } from '../../../shared/properties-search-results-filters/properties-search-results-filters.component';
import { PropertiesSearchComponent } from '../../../shared/properties-search/properties-search.component';


@Component({
  selector: 'app-brand-products',
  templateUrl: './brand-products.component.html',
  styleUrls: ['./brand-products.component.css'],
  standalone: true,
  imports: [CommonModule,MatCardModule, MatIconModule, MatChipsModule, MatListModule, MatFormFieldModule,MatSidenavModule,  , PaginationComponent, PropertiesSearchComponent, ProductItemComponent, PropertiesSearchResultsFiltersComponent],
})
export class BrandProductsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() brand: any;
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @Input()
  tabChanged!: Subject<number>;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public categoriesBS!: BehaviorSubject<Category[]>;
  public psConfig = {
    wheelPropagation: true
  };
  public products: any[] = [];
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  public viewType = 'grid';
  public removedSearchField!: string;
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public isLoading = false;
  public pagination: Pagination = new Pagination(0, this.count, 0, 0);
  public message!: string;
  public watcher!: Subscription;

  public settings: Settings;
  public searchFields: BrandProductSearch = new BrandProductSearch({
    searchId: 1,
    brandsBox: [],
    // categories: [],
    searchBox: '',
    pageQuery: new Pagination(0, 12, 0, 0)
  });
  public appSettings= inject( AppSettings);              
  private activatedRoute= inject( ActivatedRoute);

  public fb= inject( FormBuilder);
  private route= inject( ActivatedRoute);
  private router= inject( Router);
  private productService= inject( ProductsService);
  private cdRef= inject( ChangeDetectorRef);
  private authService= inject( AuthService);
  private meta= inject( Meta);
  constructor() {
    this.settings = this.appSettings.createNew()
}

  ngOnInit() {
    this.searchFields.brandsBox = [{brandId: this.brand.contentItemId, name: this.brand.displayText} as Brand];
    this.isLoading = true;
    combineLatest([this.categoriesBS.asObservable(), this.route.params]).subscribe((x: any) => { 
      if(+x[1]["tab"] !== 1)  {
        return;
      } 
      if (x[0].length > 0 &&
         (
          (x[1]["search"] && x[1]["search"].toString() !== 'null')||          
          (x[1]["collections"] && x[1]["collections"].toString() !== 'null')|| 
          (x[1]["categories"] && x[1]["categories"].toString() !== 'null'))) {
        this.getProducts(x[0],+x[1]["page"],x[1]["search"],x[1]["brands"],x[1]["collections"], x[1]["categories"]);
      } else if(x[1]["search"] && x[1]["search"].toString() === 'null' &&      
       x[1]["collections"] && x[1]["collections"].toString() === 'null' &&
       x[1]["categories"] && x[1]["categories"].toString() === 'null') {
        this.router.navigate(['/brands',  this.brand.contentItemId, 1, 1, this.brand.displayText]);

      }
      else if (+x[1]["page"] && !x[1]["search"]  && !x[1]["collections"]  && !x[1]["categories"] ){ 
       
        this.productService.getProducts(this.searchFields, `{from: ${(+x[1]["page"] - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${this.brand.displayText}'}`).subscribe((y:any) => {
        
          this.searchFields.pageQuery.totalItems = y[0].count
          this.message = y[0].count === 0 ? "موردی یافت نشد" : '';
          this.products = y[1].searchProducts;
          this.isLoading = false;
        });
      }
    })
   
   
  }

  openZoom(event: any, show: boolean) {
  }
  public searchClicked() {
    window.scrollTo(0, 0);
  }
  ngOnDestroy() {
  }

  public removeSearchField(field: string) {
    this.message = '';
    this.removedSearchField = field;
  }
  public PageChange(event: { pageIndex: number; pageSize: number; length: number; }) {
    this.searchFields = new BrandProductSearch({
      searchId: 1,
      pageQuery: new Pagination(event.pageIndex, event.pageSize, event.length, 0)
    });
    // this.store.dispatch(new SaveSearchForRequest(this.searchFields));
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
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
    //   slidesPerView: 4,
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

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new BrandProductSearch({
      searchId: 1,
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
  }



  public changeCount(count: number) {
    this.count = count;
    this.resetPagination();
    // this.getBrandProducts();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    // this.getBrandProducts();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.pagination.currentPage = e.pageIndex ;
    this.searchFields = new BrandProductSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    this.router.navigate(['/brands',  this.brand.contentItemId, 1, e.pageIndex + 1, this.brand.displayText, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', brands: this.searchFields.brandsBox.length > 0 ? this.searchFields.brandsBox.map(x => x.name).join('_'): 'null', collections:this.searchFields.brandCollectionBox.length > 0 ? this.searchFields.brandCollectionBox.map(x => x.brandCollectionId).join('_') : 'null', categories: this.searchFields.categoriesBoxNested.length > 0 ? this.searchFields.categoriesBoxNested.map(x => x.categoryId).join('_') : 'null'}]);
    window.scrollTo(0, 0);
  }
  public ReadyForDispatch(value: { brandsBox: string | any[]; brandCollectionBox: string | any[]; categoriesBoxNested: string | any[]; categoriesBox: string | any[]; imageToSearch: string | any[]; fileTypes: string | any[]; searchBox: string | any[]; }) {
    this.searchFields = new BrandProductSearch({
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
        this.router.navigate(['/brands',this.brand.contentItemId,1, 1, this.brand.displayText, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', brands: this.searchFields.brandsBox.length > 0 ? this.searchFields.brandsBox.map(x => x.name).join('_'): 'null', collections:this.searchFields.brandCollectionBox.length > 0 ? this.searchFields.brandCollectionBox.map(x => x.brandCollectionId).join('_') : 'null', categories: this.searchFields.categoriesBoxNested.length > 0 ? this.searchFields.categoriesBoxNested.map(x => x.categoryId).join('_') : 'null'}]);
          
        }
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
    this.productService.getProducts(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''} ${brands ? brands.replace('null', '').split('_').join(' ') : ''} ${ collections ? collections.replace('null', '').split('_').join(' ') : ''} ${categories ? categories.replace('null', '').split('_').map((x: string) => 'ProductCategory-'+x).join(' ') : ''}'}`).subscribe((x:any) => {
      this.searchFields.pageQuery.totalItems = x[0].count
      this.message = x[0].count === 0 ? "موردی یافت نشد" : '';
      this.products = x[1].searchProducts;
      this.isLoading = false;
    });
  }

}
