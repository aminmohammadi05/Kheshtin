import { Component, OnInit, Input, ViewChild, SimpleChange, AfterViewInit, OnChanges, inject } from '@angular/core';
// import { SwiperDirective, SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { CompareOverviewComponent } from '../compare-overview/compare-overview.component';
import { map, tap, switchMap } from 'rxjs/operators';
import moment from 'jalali-moment'; // add this 1 of 4
import { Route, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrandCollectionsComponent } from '../brand-collections/brand-collections.component';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-brand-catalog-item',
  templateUrl: './brand-catalog-item.component.html',
  styleUrls: ['./brand-catalog-item.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatCardModule, MatIconModule,  ],
})
export class BrandCatalogItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() brandCatalog: any;
  @Input() brand: any;
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
  public appSettings= inject( AppSettings);
              public authService= inject( AuthService);
              public route= inject( Router);
              public productService= inject( ProductsService);
  constructor() {
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
    if (changes['viewColChanged']) {
      this.getColumnCount(changes['viewColChanged'].currentValue);
      if (!changes['viewColChanged'].isFirstChange()) {
        if (this.brandCatalog.brandCatalogImage) {
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


