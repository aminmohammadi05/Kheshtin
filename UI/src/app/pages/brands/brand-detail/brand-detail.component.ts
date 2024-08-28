import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, 
  CUSTOM_ELEMENTS_SCHEMA,
  inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { FormGroup, FormBuilder, Validators, FormControl, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VideosComponent } from '../videos/videos.component';
import { ResellersComponent } from '../resellers/resellers.component';
import { CatalogsComponent } from '../catalogs/catalogs.component';
import { BrandProjectsComponent } from '../brand-projects/brand-projects.component';

import { AppSettings, Settings } from '../../../app.settings';
import { Pagination } from '../../../models/pagination';
import { Search } from '../../../models/search';
import { AuthService } from '../../../services/auth.service';
import { BrandCatalogService } from '../../../services/brand-catalog.service';
import { BrandCollectionService } from '../../../services/brand-collection.service';
import { BrandResellerService } from '../../../services/brand-reseller.service';
import { BrandVideoService } from '../../../services/brand-video.service';
import { BrandService } from '../../../services/brand.service';
import { getImagesWithAbsolutePath, myDomain } from '../../../services/helpers/urlHelper';
import { OfficeProjectService } from '../../../services/office-project.service';
import { ProductsService } from '../../../services/products.service';
import { BrandCatalogItemComponent } from '../../../shared/brand-catalog-item/brand-catalog-item.component';
import { BrandCollectionItemComponent } from '../../../shared/brand-collection-item/brand-collection-item.component';
import { BrandCollectionsComponent } from '../../../shared/brand-collections/brand-collections.component';
import { BrandResellerItemComponent } from '../../../shared/brand-reseller-item/brand-reseller-item.component';
import { BrandVideoItemComponent } from '../../../shared/brand-video-item/brand-video-item.component';
import { OfficeProjectItemComponent } from '../../../shared/office-project-item/office-project-item.component';
import { ProductItemComponent } from '../../../shared/product-item/product-item.component';
import { emailValidator } from '../../../theme/utils/app-validators';
import { BrandProductsComponent } from '../brand-products/brand-products.component';

@Component({
  selector: 'app-brand-detail',
  templateUrl: './brand-detail.component.html',
  styleUrls: ['./brand-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatTabsModule, MatListModule, MatFormFieldModule, MatCardModule, MatProgressSpinnerModule, ReactiveFormsModule, FlexLayoutModule, ProductItemComponent, BrandCatalogItemComponent, BrandCollectionItemComponent, BrandResellerItemComponent, BrandVideoItemComponent, OfficeProjectItemComponent, BrandProductsComponent, BrandCollectionsComponent, VideosComponent, ResellersComponent, CatalogsComponent, BrandProjectsComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrandDetailComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  @ViewChild('tabGroup', { static: true })
  tabGroup!: MatTabGroup;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  viewType = 'grid';
  viewCol = 25;
  public psConfig = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  private sub: any;
  public brand: any;
  public officeProjectsOverview!: any[];
  public productsOverview!: any[];
  public brandCollectionsOverview!: any[];
  public videosOverview!: any[];
  public resellersOverview!: any[];
  public catalogsOverview!: any[];
  public totalProducts!: Observable<number>;
  public count = 12;
  public sort!: string;
  public selectedTab = new FormControl(0);
  public searchFields: Search = new Search({
    brandsBox: [],
    categoriesBoxNested: [],
    categoriesBox: [],
    brandCollectionBox: [],
    searchBox: ''
  });
  
  public removedSearchField!: string;
  public isLoading = false;
  public pagination: Pagination = new Pagination(0, this.count, 0, 0);
  public brandCollectionPagination: Pagination = new Pagination(0, this.count, 0, 0);
  public message!: string;
  public messageCollection!: string;
  public messageCatalog!: string;
  public messageVideo!: string;
  public messageReseller!: string;
  public watcher!: Subscription;

  public settings: Settings;
  public relatedProducts!: any[];
  public featuredProducts!: any[];
  public contactForm!: FormGroup;
  brandId!: string;
  brandImage!: string;
  public appSettings= inject( AppSettings);
  private brandService= inject( BrandService);

  private brandCatalogService= inject( BrandCatalogService);
  private brandCollectionService= inject( BrandCollectionService);
  private brandOfficeProjectService= inject( OfficeProjectService);
  private brandVideoService= inject( BrandVideoService);
  private brandResellerService= inject( BrandResellerService);
  public fb= inject( FormBuilder);
  private route= inject( ActivatedRoute);
  private router= inject( Router);
  private productService= inject( ProductsService);
  private cdRef= inject( ChangeDetectorRef);
  private authService= inject( AuthService);
  private meta = inject(Meta);
  constructor() {
    this.settings = this.appSettings.createNew()
}

  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
     
      if (params['brandId']) {
        this.brandId = params['brandId'];
        this.getBrandById(this.brandId, params['tab']);
        this.tabGroup.selectedIndex = +params['tab'];
       
        
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

  public getBrandById(id: string, tab: string | number) {
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

  public getSelectedBrandCollectionsByBrandId(id: any) {
    this.brandService.getSelectedBrandCollectionsByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
     
      this.brandCollectionsOverview = x.getSelectedBrandCollectionByBrandId;
      
    });
  }
  public getSelectedProductsByBrandId(id: any) {
    this.brandService.getSelectedProductsByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
    
      this.productsOverview = x.getSelectedProductsByBrandId;
      
    });
  }
  public getSelectedVideosByBrandId(id: any) {
    this.brandService.getSelectedVideosByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
    
      this.videosOverview = x.getSelectedVideoByBrandId;
      
    });
  }

  public getSelectedCatalogsByBrandId(id: any) {
    this.brandService.getSelectedCatalogsByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
      this.catalogsOverview = x.getSelectedBrandCatalogByBrandId;
      
    });
  }
  public getSelectedProjectsByBrandId(id: any) {
    this.brandService.getSelectedProjectsByBrandId(`{from: 0, size: 10, fulltext:'${id}'}`).subscribe((x: any) => {
     
      this.officeProjectsOverview = x.getSelectedProjectsByBrandIdEls;
      
    });
  }



  ngAfterViewInit() {
    // this.config = {
    //   observer: true,
      
    //   slidesPerView: 5,
    //   spaceBetween: 32,
    //   keyboard: true,
    //   navigation: { nextEl: '.prop-next', prevEl: '.prop-prev'},
    //   pagination: true,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: true,
    //   lazy: false,
    //   breakpoints: {
    //     600: {
    //       slidesPerView: 1
    //     },
    //     960: {
    //       slidesPerView: 2,
    //     },
    //     1280: {
    //       slidesPerView: 3,
    //     }
    //   }
    // };

    // this.config2 = {
    //   observer: true,
      
    //   slidesPerView: 5,
    //   spaceBetween: 32,
    //   keyboard: true,
    //   navigation: { nextEl: '.prop-next', prevEl: '.prop-prev'},
    //   pagination: true,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: true,
    //   lazy: false,
    //   breakpoints: {
    //     600: {
    //       slidesPerView: 1
    //     },
    //     960: {
    //       slidesPerView: 2,
    //     },
    //     1280: {
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
    this.pagination = new Pagination(0, this.count, 0, 0);
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
    window.scrollTo(0, 0);
  }
  public searchChanged(event: { valueChanges: { subscribe: (arg0: () => void) => void; }; value: { categoriesBoxNested: string | any[]; brandCollectionBox: string | any[]; searchBox: string | any[]; }; }) {
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
        this.removedSearchField = '';
      });
      if (!this.settings.searchOnBtnClick) {
        
      }
    });
    
  }
  public removeSearchField(field: string) {
    this.message = '';
    this.removedSearchField = field;
  }


  public changeCount(count: number) {
    this.count = count;
    this.resetPagination();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: any) {
    window.scrollTo(0, 0);
  }


  public onContactFormSubmit(values: Object) {
    if (this.contactForm.valid) {
    }
  }

  public openTab(event: number) {

    this.tabGroup.selectedIndex = event;
    this.router.navigate(['/brands', this.brandId, this.tabGroup.selectedIndex, 1, this.brand.displayText]);
    // this.tabChanged.next(clickedIndex);
  }

  getHtml(value: string) {
    return getImagesWithAbsolutePath(value, myDomain);
  } 

}
