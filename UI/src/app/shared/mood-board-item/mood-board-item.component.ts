import { Component, OnInit, Input, ViewChild, SimpleChange, AfterViewInit, OnChanges } from '@angular/core';
// import { SwiperDirective, SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';

import { AppService } from '../../app.service';
import { CompareOverviewComponent } from '../compare-overview/compare-overview.component';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { map, tap, switchMap } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import * as moment from 'jalali-moment'; // add this 1 of 4
import { Route, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { Blog } from 'src/app/models/blog';
import { BlogService } from 'src/app/services/blog.service';
import { UserMoodBoard } from 'src/app/models/user-moodboard';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrandsCarouselComponent } from '../brands-carousel/brands-carousel.component';
import { HeaderCarouselComponent } from '../header-carousel/header-carousel.component';
import { HeaderImageComponent } from '../header-image/header-image.component';
import { MoodBoardsSearchResultsFiltersComponent } from '../mood-boards-search-results-filters/mood-boards-search-results-filters.component';
import { MoodBoardsSearchComponent } from '../mood-boards-search/mood-boards-search.component';
@Component({
  selector: 'app-mood-board-item',
  templateUrl: './mood-board-item.component.html',
  styleUrls: ['./mood-board-item.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatCardModule, MatButtonModule, FlexLayoutModule, MatFormFieldModule, RouterModule ]
})
export class MoodBoardItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() moodBoard: UserMoodBoard;
  @Input() viewType = 'grid';
  @Input() viewColChanged = false;
  @Input() fullWidthPage = true;
  liked: Observable<boolean>;
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
              public appService: AppService,
              public authService: AuthService,
              public route: Router,
              public blogService: BlogService) {
    this.settings = this.appSettings.createNew()
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
        // if (this.blog..length > 1) {
        //    this.directiveRef.update();
        // }
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




  public changeDateToFa(date) {
    return moment(date).locale('fa').format('YYYY/MM/DD');
  }

}

