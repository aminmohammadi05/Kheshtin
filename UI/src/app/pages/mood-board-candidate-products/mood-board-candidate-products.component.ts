import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { AppService } from '../../app.service';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Property } from 'src/app/app.models';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { AuthService } from 'src/app/services/auth.service';
import { map, tap } from 'rxjs/operators';
import { Pagination } from 'src/app/models/pagination';
import { ProductMoodBoardSearch } from 'src/app/models/product-mood-board-search';
import { Router } from '@angular/router';
import { UserMoodBoardCandidateProduct } from 'src/app/models/user-mood-board-candidate-product';
import { MoodBoardCandidateProductDataSource } from 'src/app/services/mood-board-candidate-product-data-source';
import { UserService } from 'src/app/services/user.service';
import { UserMoodBoardCandidateProductSearch } from 'src/app/models/user-mood-board-candidate-product-search';

@Component({
  selector: 'app-mood-board-candidate-products',
  templateUrl: './mood-board-candidate-products.component.html',
  styleUrls: ['./mood-board-candidate-products.component.scss']
})
export class MoodBoardCandidateProductsComponent implements OnInit, OnDestroy {
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  public pagination: Pagination = new Pagination(0, 12, null, null);
  public message: string;
  public settings: Settings;
  public viewType = 'grid';
  public viewCol = 33.3;
  allProducts: Product[] = [];
  products: Product[] = [];
  dataSource: MoodBoardCandidateProductDataSource;
  public searchFields = new UserMoodBoardCandidateProductSearch({
    searchId: 1,
    brandsBox: [],
    categoriesBox: [],
    colorsBox: [],
    materialsBox: []
  });
  constructor(public appSettings: AppSettings,
              public productService: ProductsService,
              public userService: UserService,
              public authService: AuthService,
              public route: Router,
              public mediaObserver: MediaObserver) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.dataSource = new MoodBoardCandidateProductDataSource(this.userService,  this.authService);
    // this.store.pipe(select(getAllUserMoodBoardCandidateProductSearches),
    // tap((searches) => {
    //   if (searches && searches.length > 0) {
    //     this.searchFields = searches[0];
    //     if (this.searchFields.pageQuery) {
    //       this.pagination = this.searchFields.pageQuery;
    //     }
    //   }})).subscribe();
    this.getProducts();
    this.config = {
      observer: true,
      slidesPerView: 4,
      spaceBetween: 16,
      keyboard: false,
      navigation: false,
      pagination: false,
      simulateTouch: false,
      grabCursor: true,
      loop: false,
      preloadImages: true,
      lazy: false,
      breakpoints: {
        600: {
          slidesPerView: 1
        },
        960: {
          slidesPerView: 2,
        },
        1280: {
          slidesPerView: 3,
        }
      }
    };
    this.watchForChanges();
  }

  ngOnDestroy() {
    
  }

  public disableSwiper() {
    setTimeout(() => {
      if (this.directiveRef) {
        this.config.keyboard = false;
        this.config.navigation = false;
        this.config.simulateTouch = false;
        this.directiveRef.update();
      }
    });
  }
  public enableSwiper() {
    setTimeout(() => {
      if (this.directiveRef) {
        this.config.keyboard = true;
        this.config.navigation = { nextEl: '.carousel-next', prevEl: '.carousel-prev' };
        this.config.simulateTouch = true;
        this.directiveRef.update();
      }
    });
  }

  public clear() {
    if (this.authService.loggedIn()) {
      // this.store.dispatch(new EmptyUserMoodBoardCandidateProductListRequest( 'filter=',
      // this.searchFields &&
      // this.searchFields.brandsBox &&
      // this.searchFields.brandsBox[0] ? this.searchFields.brandsBox : [],
      // this.searchFields &&
      // this.searchFields.categoriesBox &&
      // this.searchFields.categoriesBox[0] ?
      // this.searchFields.categoriesBox : [],
      // this.searchFields &&
      // this.searchFields.colorsBox &&
      // this.searchFields.colorsBox[0] ?
      // this.searchFields.colorsBox : [],
      // this.searchFields &&
      // this.searchFields.materialsBox &&
      // this.searchFields.materialsBox[0] ? this.searchFields.materialsBox : [],
      // this.pagination,
      // this.authService.getDecodedToken().nameid));
    } else {
      this.route.navigate(['/login']);
    }
  }

  public remove(product: Product) {
    if (this.authService.loggedIn()) {
      // this.store.dispatch(new UserUnSelectRequest(this.authService.getDecodedToken().nameid, product.productId));
    } else {
      this.route.navigate(['/login']);
    }    
    
  }

  public onPageChange(e) {
    this.searchFields = new UserMoodBoardCandidateProductSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    // this.store.dispatch(new SaveCandidateProductSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }

  getProducts() {
    this.dataSource.loadProducts();
  }
  public watchForChanges() {
    // this.watcher = this.mediaObserver.media$.subscribe((change: MediaChange) => {
    //    if (change.mqAlias === 'xs' && this.productService.Data.moodBoardList.length > 1) {
    //      this.enableSwiper();
    //    } else if (change.mqAlias === 'sm' && this.productService.Data.moodBoardList.length > 2) {
    //      this.enableSwiper();
    //    } else if (change.mqAlias === 'md' && this.productService.Data.moodBoardList.length > 3) {
    //      this.enableSwiper();
    //    } else if (change.mqAlias === 'lg' && this.productService.Data.moodBoardList.length > 4) {
    //      this.enableSwiper();
    //    } else if (change.mqAlias === 'xl' && this.productService.Data.moodBoardList.length > 4) {
    //      this.enableSwiper();
    //    } else {
    //      this.disableSwiper();
    //    }
    //  });
  }

}
