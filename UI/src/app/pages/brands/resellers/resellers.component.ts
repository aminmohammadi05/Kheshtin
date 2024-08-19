import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input } from '@angular/core';
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
import { Observable, Subject, Subscription } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Pagination } from 'src/app/models/pagination';
import { MatPaginator } from '@angular/material/paginator';
import { Category } from 'src/app/models/category';
import { Search } from 'src/app/models/search';
import { BrandSearch } from 'src/app/models/brand-search';
import { BrandCatalog } from 'src/app/models/brand-catalog';
import { BrandVideo } from 'src/app/models/brand-video';
import { BrandReseller } from 'src/app/models/brand-reseller';
import { BrandResellerSearch } from 'src/app/models/brand-reseller-search';
import { BrandResellerDataSource } from 'src/app/services/brand-reseller-data-source';
import { BrandResellerService } from 'src/app/services/brand-reseller.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';



@Component({
  selector: 'app-resellers',
  templateUrl: './resellers.component.html',
  styleUrls: ['./resellers.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatFormFieldModule, MatCardModule, MatProgressSpinnerModule, ReactiveFormsModule, FlexLayoutModule, PaginationComponent ]
})
export class ResellersComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() brand: any;
  @Input() tabChanged: Subject<number>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };

  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  public brandResellers: any[] = [];
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public isLoading = false;
  
  public message: string;
  public watcher: Subscription;

  public settings: Settings;
  public searchFields = new BrandResellerSearch({
    searchId: 1,
    searchBox: 'filter=',
    pageQuery: new Pagination(0, 12, null, null)
  });
  

  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private activatedRoute: ActivatedRoute,
              
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private brandService: BrandService,
              private productService: ProductsService,
              
              private cdRef: ChangeDetectorRef,
              private authService: AuthService,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe(x => {
      if(+x["tab"] !== 4)  {
        return;
      }
      if (+x["page"]) {
        this.searchFields = new BrandResellerSearch({
          searchId: 1,
          brandId: this.brand.contentItemId,
          searchBox: 'filter=',
          pageQuery: new Pagination(+x["page"], 12, null, null)
        });
        
        this.brandService.getBrandResellersByBrandId(this.searchFields, `{from: ${(+x["page"] - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${this.brand.contentItemId}'}`).subscribe((y:any) => {
        
          this.searchFields.pageQuery.totalItems = y[0].count
          this.message = y[0].count === 0 ? "موردی یافت نشد" : '';
          this.brandResellers = y[1].getResellerByBrandId;
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
    this.searchFields = new BrandResellerSearch({
      searchId: 1,
      searchBox: 'filter=',
      pageQuery: new Pagination(0, this.count, null, null)
    });
  }



  public changeCount(count) {
    this.count = count;
    this.resetPagination();
    this.getBrandResellers();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.getBrandResellers();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.searchFields = new BrandResellerSearch({
      searchId: 1,
      searchBox: 'filter=',
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    this.router.navigate(['/brands',  this.brand.contentItemId, 4, e.pageIndex + 1, this.brand.displayText]);
    window.scrollTo(0, 0);
  }

  public getBrandResellers() {
    
  }

}
