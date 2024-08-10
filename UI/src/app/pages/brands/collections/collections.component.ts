import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { Meta } from '@angular/platform-browser';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Property } from 'src/app/app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { EmbedVideoService } from 'ngx-embed-video';
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
import { BrandCollection } from 'src/app/models/brand-collection';
import { BrandCatalog } from 'src/app/models/brand-catalog';
import { BrandVideo } from 'src/app/models/brand-video';
import { BrandReseller } from 'src/app/models/brand-reseller';
import { BrandCollectionSearch } from 'src/app/models/brand-collection-search';
import { BrandCollectionDataSource } from 'src/app/services/brand-collection-data-source';
import { BrandCollectionService } from 'src/app/services/brand-collection.service';

@Component({
  selector: 'app-collections',
  templateUrl: './collections.component.html',
  styleUrls: ['./collections.component.css']
})
export class CollectionsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() brand: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };

  public config: SwiperConfigInterface = {};
  public config2: SwiperConfigInterface = {};
  public brandCollections: any[] = [];
  public brandAllCollections: any[] = [];
  public totalCollections: Observable<number>;
  public viewType = 'grid';
  public viewCol = 25;
  public count = 12;
  public sort: string;
  public isLoading = false;
  
  public message: string;
  public watcher: Subscription;

  public settings: Settings;
  public searchFields = new BrandCollectionSearch({
    searchId: 1,
    searchBox: 'filter=',
    pageQuery: new Pagination(0, 12, null, null)
  });
 
  dataSource: BrandCollectionDataSource;

  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private route: ActivatedRoute,
              private router: Router,
              private embedService: EmbedVideoService,
              public fb: FormBuilder,
              private productService: ProductsService,
              private brandService: BrandService,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() { 
    this.isLoading = true;
    this.route.params.subscribe(x => {
      if(+x["tab"] !== 2)  {
        return;
      }
      if (+x["page"]) {
        this.searchFields = new BrandCollectionSearch({
          searchId: 1,
          brandId: this.brand.contentItemId,
          searchBox: 'filter=',
          pageQuery: new Pagination(+x["page"], 12, null, null)
        });
        
        this.brandService.getBrandCollectionsByBrandId(this.searchFields, `{from: ${(+x["page"] - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${this.brand.contentItemId}'}`).subscribe((y:any) => {
        
          this.searchFields.pageQuery.totalItems = y[0].count
          this.message = y[0].count === 0 ? "موردی یافت نشد" : '';
          this.brandCollections = y[1].getBrandCollectionByBrandId;
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
    this.config = {
      observer: false,
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      }
    };

    this.config2 = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 16,
      keyboard: true,
      navigation: false,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    };

  }

  public onOpenedChange() {
    this.swipers.forEach(swiper => {
      if (swiper) {
        swiper.update();
      }
    });
  }

  public selectImage(index: number) {
    this.swipers.forEach(swiper => {
      if (swiper['elementRef'].nativeElement.id === 'main-carousel') {
        swiper.setIndex(index);
      }
    });
  }

  public onIndexChange(index: number) {
    this.swipers.forEach(swiper => {
      const elem = swiper['elementRef'].nativeElement;
      if (elem.id === 'small-carousel') {
        swiper.setIndex(index);
        for(let i = 0; i < elem.children[0].children.length; i++) {
          const element = elem.children[0].children[i];
          if (element.classList.contains('thumb-' + index)) {
            element.classList.add('active-thumb');
          } else {
            element.classList.remove('active-thumb');
          }
        }
      }
    });
  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new BrandCollectionSearch({
      searchId: 1,
      pageQuery: new Pagination(0, this.count, null, null)
    });
  }

    
  



  public changeCount(count) {
    this.count = count;
    this.brandCollections.length = 0;
    this.resetPagination();
    this.getBrandCollections();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.brandCollections.length = 0;
    this.getBrandCollections();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.searchFields = new BrandCollectionSearch({
      searchId: 1,
      searchBox: 'filter=',
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    this.router.navigate(['/brands',  this.brand.contentItemId, 3, e.pageIndex + 1, this.brand.displayText]);
    window.scrollTo(0, 0);
  }

  public getBrandCollections() {
    this.dataSource.loadBrandCollections();
  }

}
