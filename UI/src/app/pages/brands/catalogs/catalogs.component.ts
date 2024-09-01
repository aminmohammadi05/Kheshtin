import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input, 
  inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AppSettings, Settings } from '../../../app.settings';
import { BrandCatalogSearch } from '../../../models/brand-catalog-search';
import { Pagination } from '../../../models/pagination';
import { AuthService } from '../../../services/auth.service';
import { BrandCatalogDataSource } from '../../../services/brand-catalog-data-source';
import { BrandService } from '../../../services/brand.service';
import { ProductsService } from '../../../services/products.service';
import { BrandCatalogItemComponent } from '../../../shared/brand-catalog-item/brand-catalog-item.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatFormFieldModule, MatCardModule, MatProgressSpinnerModule, ReactiveFormsModule, BrandCatalogItemComponent, PaginationComponent ]
})
export class CatalogsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() brand: any;
  @Input()
  tabChanged!: Subject<number>;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };

  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  public brandCatalogs: any[] = [];
  public brandAllCatalogs: any[] = [];
  public totalCatalogs!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public isLoading = false;
  public message!: string;
  public watcher!: Subscription;

  public settings: Settings;
  public searchFields = new BrandCatalogSearch({
    searchId: 1,
    searchBox: 'filter=',
    pageQuery: new Pagination(0, 12, 0, 0)
  });
  dataSource!: BrandCatalogDataSource;
  public appSettings = inject( AppSettings);
              private route = inject( ActivatedRoute);
              private router = inject( Router);
              private brandService = inject( BrandService);
              
              public fb = inject( FormBuilder);
              private productService = inject( ProductsService);
              private cdRef = inject( ChangeDetectorRef);
              private authService = inject( AuthService);
              private meta = inject( Meta);
  constructor() {
    this.settings = this.appSettings.createNew()
}

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe(x => {
      if(+x["tab"] !== 5)  {
        return;
      }
      if (+x["page"]) {
        this.searchFields = new BrandCatalogSearch({
          searchId: 1,
          brandId: this.brand.contentItemId,
          searchBox: 'filter=',
          pageQuery: new Pagination(+x["page"], 12, 0, 0)
        });
        
        this.brandService.getBrandCatalogsByBrandId(this.searchFields, `{from: ${(+x["page"] - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${this.brand.contentItemId}'}`).subscribe((y:any) => {
        
          this.searchFields.pageQuery.totalItems = y[0].count
          this.message = y[0].count === 0 ? "موردی یافت نشد" : '';
          this.brandCatalogs = y[1].getBrandCatalogByBrandId;
          this.isLoading = false;
        });
      }
    });
  }

  openZoom(event: any, show: boolean) {
  }

  ngOnDestroy() {
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
    this.searchFields = new BrandCatalogSearch({
      searchId: 1,
      searchBox: 'filter=',
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
  }



  public changeCount(count: number) {
    this.count = count;
    this.brandCatalogs.length = 0;
    this.resetPagination();
    this.getBrandCatalogs();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    this.brandCatalogs.length = 0;
    this.getBrandCatalogs();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.searchFields = new BrandCatalogSearch({
      searchId: 1,
      searchBox: 'filter=',
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    this.router.navigate(['/brands',  this.brand.contentItemId, 5, e.pageIndex + 1, this.brand.displayText]);
    window.scrollTo(0, 0);
  }

  public getBrandCatalogs() {
    this.dataSource.loadBrandCatalogs();
  }

}
