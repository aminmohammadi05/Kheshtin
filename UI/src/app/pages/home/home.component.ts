import { Component, OnInit, DoCheck, OnDestroy, AfterViewInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from '../../app.service';
import { Property } from '../../app.models';
import { Subscription, Observable, of, combineLatest, fromEvent, Subject } from 'rxjs';
import { FlexLayoutModule, MediaChange, MediaObserver } from '@angular/flex-layout';
import { debounceTime, distinctUntilChanged, tap, map, switchMap, withLatestFrom, filter, mergeMap } from 'rxjs/operators';
import { Category } from 'src/app/models/category';
import { Brand } from 'src/app/models/brand';
import { Pagination } from 'src/app/models/pagination';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { InitializeService } from 'src/app/services/initialize.service';
import { PageImages } from 'src/app/models/page-images';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { Search } from 'src/app/models/search';
import { OfficeProject } from 'src/app/models/office-project';
import { OfficeProjectService } from 'src/app/services/office-project.service';
import { CategoriesQuickAccessService } from 'src/app/shared/categories-quick-access/categories-quick-access.service';
import { Blog } from 'src/app/models/blog';
import { BlogService } from 'src/app/services/blog.service';
import { BrandService } from 'src/app/services/brand.service';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { EventService } from 'src/app/services/event.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HomeEventTimelineComponent } from './home-event-timeline/home-event-timeline.component';
import { RecentBlogsComponent } from './recent-blogs/recent-blogs.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HeaderCarouselComponent } from 'src/app/shared/header-carousel/header-carousel.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FlexLayoutModule, MatProgressSpinnerModule, HomeEventTimelineComponent, RecentBlogsComponent, HeaderCarouselComponent],
})
export class HomeComponent implements OnInit, OnDestroy, AfterViewInit {
  public quickCategorySubject = new Subject<any>();
  subscription = new Subscription();
  watcher: Subscription;
  activeMediaQuery = '';
  public isUserAuthenticated: Observable<boolean>;
  public categories: Observable<Category[]>;
  public brands: Brand[];
  public slides: PageImages[] = [];
  // public properties: Property[];
  public products: Product[];
  public latestProducts: Product[];
  public viewType = 'grid';
  public viewCol = 25;
  public count = 4;
  public sort: string;
  public searchFields: Search = new Search({
    brandsBox: [],
    categoriesBoxNested: [],
    categoriesBox: [],
    brandCollectionBox: [],
    fileTypes: [],
    imageUploaded: '',
    searchBox: '',
    vertical: false
  });
  public removedSearchField: string;
  selectedCategoryForMenu: any;
  public isLoading = false;
  public showProductsSection = false;
  public pagination: Pagination = new Pagination(0, this.count, null, null);
  public message: string;
  public recentProductsTextures: Observable<Product[]>;
  public latestOfficeProjects: Observable<OfficeProject[]>;
  public latestBlogs: Blog[];
  public latestEvents: Observable<any[]>;
  public homeServices: any[];

  @ViewChild('quickCategory') quickCategory;

  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              public productService: ProductsService,
              public brandService: BrandService,
              public basicService: BasicDataService,
              public officeProjectService: OfficeProjectService,
              public initializeService: InitializeService,
              public categoriesQuickAccessService: CategoriesQuickAccessService,
              public blogService: BlogService,
              public eventService: EventService,
              public router: Router,
              public mediaObserver: MediaObserver,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.productService.getLatestProductsHome('{from: 0, size: 4}').subscribe(x => {
      this.latestProducts = x.getLatestProductsHome;
    });
    this.blogService.getLatestBlogsHome('{from: 0, size: 3}').subscribe(x => {
      this.latestBlogs = x.getLatestBlogsHome;
    });
    this.latestEvents = this.eventService.getLatestEvents( 10, 0);
    this.officeProjectService.getLatestOfficeProjectsHome('{from: 0, size: 4}').subscribe(x => {
      this.latestOfficeProjects = x.getLatestOfficeProjectsHome;
    });
    this.brandService.getBrandsSelectedForHome('{from: 0, size: 4}').subscribe(x => {
      this.brands = x.getBrandsSelectedForHome;
    });
    this.basicService.getHomeServices().subscribe(x => {
      this.homeServices = x.homeService;
    });
    // this.getSlides();
    this.getProducts();
  }

  ngAfterViewInit() {
    this.quickCategorySubject.pipe(
      tap(cat => {this.selectedCategoryForMenu = cat; this.isLoading = true;
      }),
      debounceTime(2000)
    ).subscribe(x =>
      {

        this.isLoading = false;
        // tslint:disable-next-line:no-shadowed-variable
        this.productService.getProductsOfSelectedCategoryHome(`{from: 0, size: 4, fulltext:'ProductCategory-${x.id}'}`).subscribe(x => {
        this.products = x.getProductsByCategoryIdHome;
      });
      });
    this.cdRef.detectChanges();
  }

  startLoad() {
    this.getProducts();
  }

  ngOnDestroy() {
    this.resetLoadMore();
  }

  public getSlides() {
    if (this.authService.loggedIn()) {
      this.initializeService.getPageImagesAuth(this.authService.getDecodedToken().nameid, 1).subscribe(x => {
        this.slides = x;
      });
    } else {
      this.initializeService.getPageImages(1).subscribe(x => {
        this.slides = x;
      });
    }
  }

  public getProducts() {
    this.isLoading = true;
  }

  public resetLoadMore() {
    this.settings.loadMore.complete = false;
    this.settings.loadMore.start = false;
    this.settings.loadMore.page = 0;
    this.pagination = new Pagination(0, this.count, null, null);
  }


  public searchClicked(event) {
    this.router.navigate(['/products']);
  }
  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetLoadMore();
      this.searchFields = event.value;
      setTimeout(() => {
        this.removedSearchField = null;
      });
    });
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        this.getProducts();
      }
    });
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }


  getProductsOfCategory(category: any ) {
  }
  openProductsPart(isOpen) {
    this.isLoading = true;
    this.showProductsSection = isOpen;
  }
}
