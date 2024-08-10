import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { Meta } from '@angular/platform-browser';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Property } from 'src/app/app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { EmbedVideoService } from 'ngx-embed-video';
import { CompareOverviewComponent } from 'src/app/shared/compare-overview/compare-overview.component';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { BrandService } from 'src/app/services/brand.service';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PaginatedResult, Pagination } from 'src/app/models/pagination';
import { MatPaginator } from '@angular/material/paginator';
import { Category } from 'src/app/models/category';
import { Search } from 'src/app/models/search';
import { BrandSearch } from 'src/app/models/brand-search';
import { BrandCollection } from 'src/app/models/brand-collection';
import { BrandCatalog } from 'src/app/models/brand-catalog';
import { BrandVideo } from 'src/app/models/brand-video';
import { BrandReseller } from 'src/app/models/brand-reseller';
import { NIL } from 'uuid';
import * as uuid from 'uuid';
import { OfficeProject } from 'src/app/models/office-project';
import { BrandCatalogDataSource } from 'src/app/services/brand-catalog-data-source';
import { BrandResellerDataSource } from 'src/app/services/brand-reseller-data-source';
import { BrandCollectionDataSource } from 'src/app/services/brand-collection-data-source';
import { BrandOfficeProjectsDataSource } from 'src/app/services/brand-office-project-data-source';
import { BrandVideoDataSource } from 'src/app/services/brand-video-data-source';
import { BrandProductDataSource } from 'src/app/services/brand-product-data-source';
import { BrandCatalogService } from 'src/app/services/brand-catalog.service';
import { BrandCollectionService } from 'src/app/services/brand-collection.service';
import { BrandVideoService } from 'src/app/services/brand-video.service';
import { BrandResellerService } from 'src/app/services/brand-reseller.service';
import { OfficeProjectService } from 'src/app/services/office-project.service';
import { MatTabGroup } from '@angular/material/tabs';
import { BrandCollectionSearch } from 'src/app/models/brand-collection-search';

@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.component.html',
  styleUrls: ['./brand-detail.component.css']
})
export class BrandDetailComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  viewType = 'grid';
  viewCol = 25;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  public config: SwiperConfigInterface = {};
  public config2: SwiperConfigInterface = {};
  private sub: any;
  public brand: any;
  public officeProjectsOverview: any[];
  public productsOverview: any[];
  public brandCollectionsOverview: any[];
  public videosOverview: any[];
  public resellersOverview: any[];
  public catalogsOverview: any[];
  public totalProducts: Observable<number>;
  public count = 12;
  public sort: string;
  public selectedTab = new FormControl(0);
  public searchFields: Search = new Search({
    brandsBox: [],
    categoriesBoxNested: [],
    categoriesBox: [],
    brandCollectionBox: [],
    searchBox: ''
  });
  
  public removedSearchField: string;
  public isLoading = false;
  public pagination: Pagination = new Pagination(0, this.count, null, null);
  public brandCollectionPagination: Pagination = new Pagination(0, this.count, null, null);
  public message: string;
  public messageCollection: string;
  public messageCatalog: string;
  public messageVideo: string;
  public messageReseller: string;
  public watcher: Subscription;

  public settings: Settings;
  public relatedProducts: any[];
  public featuredProducts: any[];
  public contactForm: FormGroup;
  brandId: string;
  brandImage: string;
 
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private brandService: BrandService,
              private embedService: EmbedVideoService,
              private brandCatalogService: BrandCatalogService,
              private brandCollectionService: BrandCollectionService,
              private brandOfficeProjectService: OfficeProjectService,
              private brandVideoService: BrandVideoService,
              private brandResellerService: BrandResellerService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private productService: ProductsService,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
     
      if (params.brandId) {
        this.brandId = params.brandId;
        this.getBrandById(this.brandId, params.tab);
        this.tabGroup.selectedIndex = +params.tab;
       
        
      } else {
        this.router.navigate(['/**']);
      }
    });

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
      this.sidenav.close();
    }

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
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

  public getBrandById(id, tab) {
    if(+tab === 0) {
      this.getSelectedBrandCollectionsByBrandId(id);
      this.getSelectedVideosByBrandId(id);
      this.getSelectedCatalogsByBrandId(id);
      this.getSelectedProjectsByBrandId(id);
    }
    
    this.brandService.getBrandById(id).subscribe((x: any) => {
      this.brand = x.brand[0];
      this.getSelectedProductsByBrandId(this.brand.displayText);
      if (x.brand[0]){
        this.brandService.getBrandTotalProducts(x.brand[0].displayText).subscribe(y => {
          this.brand.totalProducts = y.count;
        });
      }
    });
  }

  public getSelectedBrandCollectionsByBrandId(id) {
    this.brandService.getSelectedBrandCollectionsByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
     
      this.brandCollectionsOverview = x.getSelectedBrandCollectionByBrandId;
      
    });
  }
  public getSelectedProductsByBrandId(id) {
    this.brandService.getSelectedProductsByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
    
      this.productsOverview = x.getSelectedProductsByBrandId;
      
    });
  }
  public getSelectedVideosByBrandId(id) {
    this.brandService.getSelectedVideosByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
    
      this.videosOverview = x.getSelectedVideoByBrandId;
      
    });
  }

  public getSelectedCatalogsByBrandId(id) {
    this.brandService.getSelectedCatalogsByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
      this.catalogsOverview = x.getSelectedBrandCatalogByBrandId;
      
    });
  }
  public getSelectedProjectsByBrandId(id) {
    this.brandService.getSelectedProjectsByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
     
      this.officeProjectsOverview = x.getSelectedProjectByBrandId;
      
    });
  }



  ngAfterViewInit() {
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
    this.pagination = new Pagination(0, this.count, null, null);
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
    window.scrollTo(0, 0);
  }
  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      this.searchFields = new Search({
        searchId: 1,
        categoriesBoxNested: event.value.categoriesBoxNested &&
           event.value.categoriesBoxNested.length > 0 ? event.value.categoriesBoxNested : [],
        brandCollectionBox: event.value.brandCollectionBox &&
           event.value.brandCollectionBox.length > 0 ? event.value.brandCollectionBox : [],
        searchBox: event.value.searchBox &&
        event.value.searchBox.length > 0 ? event.value.searchBox : '',
      });
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        
      }
    });
    
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }


  public changeCount(count) {
    this.count = count;
    this.resetPagination();
  }
  public changeSorting(sort) {
    this.sort = sort;
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    window.scrollTo(0, 0);
  }


  public onContactFormSubmit(values: Object) {
    if (this.contactForm.valid) {
    }
  }

  public openTab(event) {

    this.tabGroup.selectedIndex = event;
    this.router.navigate(['/brands', this.brandId, this.tabGroup.selectedIndex, 1, this.brand.displayText]);
    // this.tabChanged.next(clickedIndex);
  }



}
