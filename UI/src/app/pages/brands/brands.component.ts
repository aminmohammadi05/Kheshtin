import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { , MediaChange, MediaObserver } from '@angular/flex-layout';
import {  } from 'ngx-scrollbar';
import { Observable, fromEvent, merge, Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap, skip, switchMap, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppSettings, Settings } from '../../app.settings';
import { Brand } from '../../models/brand';
import { BrandSearch } from '../../models/brand-search';
import { Category } from '../../models/category';
import { PageImages } from '../../models/page-images';
import { Pagination } from '../../models/pagination';
import { AuthService } from '../../services/auth.service';
import { BrandService } from '../../services/brand.service';
import { InitializeService } from '../../services/initialize.service';
import { ProductsService } from '../../services/products.service';
import { BrandItemComponent } from '../../shared/brand-item/brand-item.component';
import { BrandsCarouselComponent } from '../../shared/brands-carousel/brands-carousel.component';
import { BrandsSearchResultsFiltersComponent } from '../../shared/brands-search-results-filters/brands-search-results-filters.component';
import { BrandsSearchComponent } from '../../shared/brands-search/brands-search.component';
import { HeaderCarouselComponent } from '../../shared/header-carousel/header-carousel.component';
import { HeaderImageComponent } from '../../shared/header-image/header-image.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatSidenavModule, MatFormFieldModule, MatCardModule, MatProgressSpinnerModule, ReactiveFormsModule, PaginationComponent, HeaderCarouselComponent, HeaderImageComponent, BrandsSearchComponent, BrandsSearchResultsFiltersComponent, BrandItemComponent, BrandsCarouselComponent ]
})
export class BrandsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  public categoriesBS!: BehaviorSubject<Category[]>;
  public psConfig = {
    wheelPropagation: true
  };
  public allBrands: Brand[] = [];
  public brands: Brand[] = [];
  public slides: PageImages[] = [];
  public totalBrands!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 25;
  public count = 12;
  public sort!: string;
  public searchFields: BrandSearch = new BrandSearch({
    searchId: 1,
    categoriesBoxNested: [],
    categoriesBox: [],
   // brandCollectionsBox: [],
    searchBox: '',
    pageQuery: new Pagination(0, this.count, 0, 0)
  });
  public removedSearchField!: string;
  public isLoading = false;
  public message!: string;
  public watcher!: Subscription;

  public settings: Settings;

  categoryId!: number;
  searchTerm = '';
  public appSettings= inject( AppSettings);
              private authService= inject( AuthService);
              public mediaObserver= inject( MediaObserver);
              public initializeService= inject( InitializeService);
              private route= inject( ActivatedRoute);
              private router= inject( Router);
              private productService= inject( ProductsService);
              private brandService= inject( BrandService);
              private cdRef= inject( ChangeDetectorRef);
  constructor() {
    this.settings = this.appSettings.createNew()
//     this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
//     if (change.mqAlias === 'xs') {
//       this.sidenavOpen = false;
//       this.viewCol = 100;
//     } else if (change.mqAlias === 'sm') {
//       this.sidenavOpen = false;
//       this.viewCol = 50;
//     } else if (change.mqAlias === 'md') {
//       this.viewCol = 50;
//       this.sidenavOpen = true;
//     } else {
//       this.viewCol = 33.3;
//       this.sidenavOpen = true;
//     }
// });

}

  ngOnInit() {
    this.isLoading = true;
    combineLatest([this.categoriesBS.asObservable(), this.route.params]).subscribe((x: any) => {      
      if (x[0].length > 0 &&
         (
          (x[1]["search"] && x[1]["search"].toString() !== 'null')||         
          (x[1]["categories"] && x[1]["categories"].toString() !== 'null'))) {
        this.getBrands(x[0],+x[1]["page"],x[1]["search"], x[1]["categories"]);
      } else if(x[1]["search"] && x[1]["search"].toString() === 'null' &&
       x[1]["categories"] && x[1]["categories"].toString() === 'null') {
        this.router.navigate(['/brands', this.searchFields.pageQuery.currentPage + 1]);

      }
      else if (+x[1]["page"] && !x[1]["search"] && !x[1]["categories"] ){        
        this.brandService.getAllBrands(this.searchFields.pageQuery.itemsPerPage, this.searchFields.pageQuery.itemsPerPage * (+x[1]["page"] - 1)).subscribe((x:any) => {
          this.searchFields.pageQuery.totalItems = x[0].items[0].BrandCount;
          this.message = x[0].items[0].BrandCount === 0 ? "موردی یافت نشد" : '';
          this.brands = x[1].brand;
          this.isLoading = false;
        });
      }
    })
    // this.dataSource = new BrandsDataSource(this.brandService, this.store, this.authService);
    // this.getSlides();
    // this.store.pipe(select(getAllBrandSearches),
    // tap((searches) => {
    //   if (searches && searches.length > 0) {
    //     this.searchFields = searches[0];
    //   } else {
    //     this.store.dispatch(new SaveBrandSearchForRequest(this.searchFields));
    //   }
    // })).subscribe();
    // this.dataSource.loadBrands();
   
  }
  ngAfterViewInit() {
  }
  public getSlides() {
    if (this.authService.loggedIn()) {
      this.initializeService.getPageImagesAuth(this.authService.getDecodedToken().nameid, 4).subscribe(x => {
        this.slides = x;
      });
    } else {
      this.initializeService.getPageImages(4).subscribe(x => {
        this.slides = x;
      });
    }
  }
  public getBrands(cats: any[], currentPage: number, search: string, categories: { replace: (arg0: string, arg1: string) => { (): any; new(): any; split: { (arg0: string): { (): any; new(): any; length: number; includes: { (arg0: any): any; new(): any; }; join: { (arg0: string): any; new(): any; }; }; new(): any; }; }; }) {
    
    this.searchFields = new BrandSearch({
      searchId: 1,
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
    pageQuery: new Pagination(currentPage - 1, this.count, 0, 0)
    })
    this.brandService.getBrands(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''}  ${categories ? categories.replace('null', '').split('_').join(' ') : ''}'}`).subscribe((x:any) => {
      this.searchFields.pageQuery.totalItems = x[0].count
      this.message = x[0].count === 0 ? "موردی یافت نشد" : '';
      this.brands = x[1].searchBrands;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
  
  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new BrandSearch({
      searchId: 1,
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
    this.brands.length = 0;
  
    window.scrollTo(0, 0);
  }
  public searchChanged(event: { value: { categoriesBoxNested: string | any[]; }; }) {
    if(event) {
      this.resetPagination();
      this.searchFields = new BrandSearch({
        searchId: 1,
        categoriesBoxNested: event.value.categoriesBoxNested &&
           event.value.categoriesBoxNested.length > 0 ? event.value.categoriesBoxNested : [],
           searchBox: '',
        pageQuery: new Pagination(0, this.count, 0, 0)
      });
      setTimeout(() => {
        this.removedSearchField = '';
      });
      if (!this.settings.searchOnBtnClick) {
        this.brands.length = 0;
        this.router.navigate(['/brands', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categoriesBoxNested.length > 0 ? this.searchFields.categoriesBoxNested.map(x => x.categoryId).join('_') : 'null'}]);
      }
    }
    
  }
  public removeSearchField(field: string) {
   
    this.message = '';
    this.removedSearchField = field;
  }


  public changeCount(count: number) {
    this.count = count;
    this.brands.length = 0;
    this.resetPagination();
    // this.getBrands();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    this.brands.length = 0;
    // this.getBrands();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.searchFields = new BrandSearch({
      searchId: 1,
      searchBox: '',
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    // this.store.dispatch(new SaveBrandSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }
}
