import { Component, OnInit, Input, ViewChild, SimpleChange, AfterViewInit, OnChanges, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
// import { SwiperDirective, SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';

import moment from 'jalali-moment'; // add this 1 of 4
import { Route, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { BlogBagTypePipe } from '../../theme/pipes/blog-bag.pipe';
@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatFormFieldModule, RouterModule, BlogBagTypePipe],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BlogItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() blog: any;
  @Input() viewType = 'grid';
  @Input() viewColChanged = false;
  @Input() fullWidthPage = true;
  liked!: Observable<boolean>;
  public column = 4;
  // public address:string;
  // @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  // public config: SwiperConfigInterface = {};
  // private pagination: SwiperPaginationInterface = {
  //   el: '.swiper-pagination',
  //   clickable: true
  // };
  public settings: Settings;
  public appSettings = inject(AppSettings);
              public authService = inject(AuthService);
              public route= inject(Router);
              public blogService = inject(BlogService);
  constructor() {
    this.settings = this.appSettings.createNew();
  }

  ngOnInit() { }

  ngAfterViewInit() {
    this.initCarousel();
    // this.appService.getAddress(this.property.location.lat, this.property.location.lng).subscribe(data=>{
   
    //   this.address = data['results'][0]['formatted_address'];
    // })
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes['viewColChanged']) {
      this.getColumnCount(changes['viewColChanged'].currentValue);
      if (!changes['viewColChanged'].isFirstChange()) {
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

  public getColumnCount(value: number) {
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

  public getStatusBgColor(status: any) {
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




  public changeDateToFa(date: any) {
    return moment(date).locale('fa').format('YYYY/MM/DD');
  }

}

