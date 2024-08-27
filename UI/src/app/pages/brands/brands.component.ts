import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FlexLayoutModule, MediaChange, MediaObserver } from '@angular/flex-layout';
import {  } from 'ngx-scrollbar';
import { Observable, fromEvent, merge, Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { ProductsDataSource } from 'src/app/services/products-data-source';
import { CategoryService } from 'src/app/services/category.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap, skip, switchMap, map } from 'rxjs/operators';
import { Pagination } from 'src/app/models/pagination';

import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { Category } from 'src/app/models/category';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { PageImages } from 'src/app/models/page-images';
import { InitializeService } from 'src/app/services/initialize.service';
import { BrandSearch } from 'src/app/models/brand-search';
import { BrandsDataSource } from 'src/app/services/brands-data-source';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { HeaderCarouselComponent } from 'src/app/shared/header-carousel/header-carousel.component';
import { HeaderImageComponent } from 'src/app/shared/header-image/header-image.component';
import { BrandsSearchComponent } from 'src/app/shared/brands-search/brands-search.component';
import { BrandsSearchResultsFiltersComponent } from 'src/app/shared/brands-search-results-filters/brands-search-results-filters.component';
import { BrandItemComponent } from 'src/app/shared/brand-item/brand-item.component';
import { BrandsCarouselComponent } from 'src/app/shared/brands-carousel/brands-carousel.component';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-brands',
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatSidenavModule, MatFormFieldModule, MatCardModule, MatProgressSpinnerModule, ReactiveFormsModule, FlexLayoutModule, PaginationComponent, HeaderCarouselComponent, HeaderImageComponent, BrandsSearchComponent, BrandsSearchResultsFiltersComponent, BrandItemComponent, BrandsCarouselComponent ]
})
export class BrandsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public categoriesBS : BehaviorSubject<Category[]> = new BehaviorSubject([]);
  public psConfig = {
    wheelPropagation: true
  };
  public allBrands: Brand[] = [];
  public brands: Brand[] = [];
  public slides: PageImages[] = [];
  public totalBrands: Observable<number>;
  public viewType = 'grid';
  public viewCol = 25;
  public count = 12;
  public sort: string;
  public searchFields: BrandSearch = new BrandSearch({
    searchId: 1,
    categoriesBoxNested: [],
    categoriesBox: [],
    brandCollectionsBox: [],
    searchBox: '',
    pageQuery: new Pagination(0, this.count, null, null)
  });
  public removedSearchField: string;
  public isLoading = false;
  public message: string;
  public watcher: Subscription;

  public settings: Settings;

  categoryId: number;
  searchTerm = '';
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private authService: AuthService,
              public mediaObserver: MediaObserver,
              public initializeService: InitializeService,
              private route: ActivatedRoute,
              private router: Router,
              private productService: ProductsService,
              private brandService: BrandService,
              private cdRef: ChangeDetectorRef) {
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
  public getBrands(cats, currentPage, search, categories) {
    
    this.searchFields = new BrandSearch({
      searchId: 1,
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
    pageQuery: new Pagination(currentPage - 1, this.count, null, null)
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
      pageQuery: new Pagination(0, this.count, null, null)
    });
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
    this.brands.length = 0;
  
    window.scrollTo(0, 0);
  }
  public searchChanged(event) {
    if(event) {
      this.resetPagination();
      this.searchFields = new BrandSearch({
        searchId: 1,
        categoriesBoxNested: event.value.categoriesBoxNested &&
           event.value.categoriesBoxNested.length > 0 ? event.value.categoriesBoxNested : [],
           searchBox: '',
        pageQuery: new Pagination(0, this.count, null, null)
      });
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        this.brands.length = 0;
        this.router.navigate(['/brands', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categoriesBoxNested.length > 0 ? this.searchFields.categoriesBoxNested.map(x => x.categoryId).join('_') : 'null'}]);
      }
    }
    
  }
  public removeSearchField(field) {
   
    this.message = null;
    this.removedSearchField = field;
  }


  public changeCount(count) {
    this.count = count;
    this.brands.length = 0;
    this.resetPagination();
    // this.getBrands();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.brands.length = 0;
    // this.getBrands();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.searchFields = new BrandSearch({
      searchId: 1,
      searchBox: '',
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    // this.store.dispatch(new SaveBrandSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }
}
