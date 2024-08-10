import { Component, OnInit, Input, ViewChild, SimpleChange, AfterViewInit, OnChanges } from '@angular/core';
import { SwiperDirective, SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';

import { AppService } from '../../app.service';
import { CompareOverviewComponent } from '../compare-overview/compare-overview.component';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { map, tap, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'jalali-moment'; // add this 1 of 4
import { Route, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-small-product-item',
  templateUrl: './small-product-item.component.html',
  styleUrls: ['./small-product-item.component.scss']
})
export class SmallProductItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() product: any;
  @Input() viewType = 'grid';
  @Input() viewColChanged = false;
  @Input() fullWidthPage = true;
  liked: Observable<boolean>;
  categoryList = '';
  brandName = '';
  public column = 4;
  // public address:string;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              public authService: AuthService,
              public route: Router,
              public productService: ProductsService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if (this.product && this.product.productFiles && this.product.productFiles[0]) {
      this.product.productFiles.sort((a, b) => {
        const fileIda = a.productFileId;
        const fileIdb = b.productFileId;
        if (fileIda < fileIdb) {
          return -1;
        }
        if (fileIda > fileIdb) {
          return 1;
        }
  
        return 0;
      });
    }
    
   }

  ngAfterViewInit() {
    this.initCarousel();
    this.getCategoriesNames();
    this.getBrandName();
    // this.appService.getAddress(this.property.location.lat, this.property.location.lng).subscribe(data=>{
  
    //   this.address = data['results'][0]['formatted_address'];
    // })
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes.viewColChanged) {
      this.getColumnCount(changes.viewColChanged.currentValue);
      if (!changes.viewColChanged.isFirstChange()) {
        if (this.product.productFiles.length > 1) {
           this.directiveRef.update();
        }
      }
    }

    // for (let propName in changes) {
      // let changedProp = changes[propName];
      // if (!changedProp.isFirstChange()) {
      //   if(this.property.gallery.length > 1){
      //     this.initCarousel();
      //     this.config.autoHeight = true;
      //     this.directiveRef.update();
      //   }
      // }
    // }
  }

  public getColumnCount(value) {
    if (value === 25) {
      this.column = 4;
    } else if (value === 33.3) {
      this.column = 3;
    } else if (value === 50) {
      this.column = 2;
    } else {
      this.column = 1;
    }
  }

  public getStatusBgColor(status) {
    switch (status) {
      case 'For Sale':
        return '#558B2F';
      case 'For Rent':
        return '#1E88E5';
      case 'Open House':
        return '#009688';
      case 'No Fees':
        return '#FFA000';
      case 'Hot Offer':
        return '#F44336';
      case 'Sold':
        return '#000';
      default:
        return '#01579B';
    }
  }


  public initCarousel() {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: false,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: true,
      preloadImages: false,
      lazy: true,
      nested: true,
      // autoplay: {
      //   delay: 5000,
      //   disableOnInteraction: false
      // },
      speed: 500,
      effect: 'slide'
    };
  }


  public addToCompare() {
    this.productService.addToCompare(this.product, CompareOverviewComponent, (this.settings.rtl) ? 'rtl' : 'ltr');
  }

  public onCompare() {
    return this.productService.Data.compareList.filter(item => item.productId === this.product.productId)[0];
  }

  public addToFavorites() {
    // this.store.pipe(select(getAllUserFavorites),
    // map((favorites) => {
    //   if (this.authService.loggedIn()) {
    //     if (!favorites.filter(item => item.productId === this.product.productId)[0]) {
    //       this.productService.addToFavorites(this.product, (this.settings.rtl) ? 'rtl' : 'ltr');
    //       this.store.dispatch(new UserLikeRequest(this.authService.getDecodedToken().nameid, this.product.productId));
    //     }
    //   } else {
    //     this.route.navigate(['/login']);
    //   }
    // })).subscribe();
  }



  public onFavorites() {
    // this.store.pipe(select(getAllUserFavorites),
    // map(favorites => {
    //   return favorites.filter(item => item.productId === this.product.productId)[0] === null ||
    //          favorites.filter(item => item.productId === this.product.productId)[0] === undefined;
    // }));
  }

  public changeDateToFa(date) {
    const cdate = moment(date).locale('fa').format('YYYY/MM/DD');
    return of(cdate);
  }

  public getCategoriesNames() {
    if (this.product) {
      return this.product.productCategory.contentItems.map(x => x.displayText).join(', ');
    } 
    return '';

  }
  public getBrandName() {
    if (this.product) {
      // return this.store.pipe(select(getBrandById(this.product.brandProductCollectionList[0].brandCollection.brandId)),
      // map((brand) => {
      //   if (brand) {
      //     return brand.name;
      //   }
      // }));
    } else {
      return of('');
    }

  }

}

