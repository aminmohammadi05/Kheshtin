import { Component, OnInit, Input, ViewChild, SimpleChange, AfterViewInit, OnChanges, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { SwiperDirective, SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';

import { AppService } from '../../app.service';
import { CompareOverviewComponent } from '../compare-overview/compare-overview.component';
import { Event as LocalEvent } from 'src/app/models/event';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import * as moment from 'jalali-moment';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { HeaderCarouselComponent } from '../header-carousel/header-carousel.component';
import { HeaderImageComponent } from '../header-image/header-image.component';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-event-item',
  templateUrl: './event-item.component.html',
  styleUrls: ['./event-item.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, FlexLayoutModule, HeaderImageComponent, MatChipsModule, MatListModule, MatSidenavModule, RouterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() event: any;
  @Input() viewType = 'grid';
  @Input() viewColChanged = false;
  @Input() fullWidthPage = true;
  public column = 4;
  // public address:string;
  // @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  // public config: SwiperConfigInterface = {};
  // private pagination: SwiperPaginationInterface = {
  //   el: '.swiper-pagination',
  //   clickable: true
  // };
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public appService: AppService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initCarousel();
    // this.appService.getAddress(this.property.location.lat, this.property.location.lng).subscribe(data=>{

    //   this.address = data['results'][0]['formatted_address'];
    // })
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes.viewColChanged) {
      this.getColumnCount(changes.viewColChanged.currentValue);
      if (!changes.viewColChanged.isFirstChange()) {
        if (this.event.eventImageList.contentItems.length > 1) {
          //  this.directiveRef.update();
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
    // this.config = {
    //   slidesPerView: 1,
    //   spaceBetween: 0,
    //   keyboard: false,
    //   navigation: true,
    //   pagination: this.pagination,
    //   grabCursor: true,
    //   loop: true,
    //   preloadImages: false,
    //   lazy: true,
    //   nested: true,
    //   // autoplay: {
    //   //   delay: 5000,
    //   //   disableOnInteraction: false
    //   // },
    //   speed: 500,
    //   effect: 'slide'
    // };
  }


  public addToCompare() {
    // this.appService.addToCompare(this.product, CompareOverviewComponent, (this.settings.rtl) ? 'rtl' : 'ltr');
  }

  public onCompare() {
    // return this.appService.Data.compareList.filter(item => item.productId === this.product.productId)[0];
  }

  public addToFavorites() {
    // this.appService.addToFavorites(this.product, (this.settings.rtl) ? 'rtl':'ltr');
  }

  public onFavorites() {
    // return this.appService.Data.favorites.filter(item=>item.id == this.property.id)[0];
  }

  public getCategoriesNames() {
    // if (this.event) {
    //   return this.store.pipe(select(getEventCategoryListById(this.event.eventCategorySetList.map(x => x.eventCategoryId))),
    //   map((cats) => {
    //     if (cats && cats[0]) {
    //       return cats.map(y => y.name).join(', ');
    //     }
    //   }));
    // } else {
    //   return of('');
    // }

  }
  getEventImages(event){
    return event.bag.contentItems.filter(x => x.__typename === "EventImage");
  }
  public getRemainingTime(e: any) {
    
   
    var current = moment().startOf('day');
    var remainingTime = '';  
   
    for(let step of e.bag.contentItems.filter(x => x.__typename === 'EventStep')) {
    
      var duration =  moment(step.stepDate).locale('fa').diff(moment(current).locale('fa'), 'days');
    
      if(Math.round(duration) > 0) {   
       
        remainingTime =  `${Math.round( duration)}روز مانده به ${step.userTitle}`;
        break;
      }
    }
    return remainingTime ? remainingTime : "اتمام مهلت";
  
    
  
  }
  public changeDateToFa(date) {
    return moment(date).locale('fa').format('YYYY/MM/DD');
  }
}

