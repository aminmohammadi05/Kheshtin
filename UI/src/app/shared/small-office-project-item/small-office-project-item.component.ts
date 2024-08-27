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
import { OfficeProject } from 'src/app/models/office-project';
@Component({
  selector: 'app-small-office-project-item',
  templateUrl: './small-office-project-item.component.html',
  styleUrls: ['./small-office-project-item.component.scss']
})
export class SmallOfficeProjectItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() officeProject: any;
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
    this.settings = this.appSettings.createNew()
  }

  ngOnInit() {
    
    if (this.officeProject && this.officeProject.imageList && this.officeProject.imageList.contentItems && this.officeProject.imageList.contentItems[0]) {
      this.officeProject.imageList.contentItems.sort((a, b) => {
        const fileIda = a.contentItemId;
        const fileIdb = b.contentItemId;
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
    // this.appService.getAddress(this.property.location.lat, this.property.location.lng).subscribe(data=>{
  
    //   this.address = data['results'][0]['formatted_address'];
    // })
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}) {
    if (changes.viewColChanged) {
      this.getColumnCount(changes.viewColChanged.currentValue);
      if (!changes.viewColChanged.isFirstChange()) {
        if (this.officeProject.imageList.contentItems.length > 1) {
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

  getOfficeProjectImages(project){
   
    return project.bag.contentItems.filter(x => x.__typename === "ProjectImage");
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



  public getCategoriesNames() {
    if (this.officeProject) {
      return this.officeProject.projectType.contentItems.map(x => x.displayText).join(', ')
    } else {
      return '';
    }

  }
  public getDesignOfficeName() {
    if (this.officeProject) {
      return this.officeProject.designOffice.contentItems.map(x => x.displayText).join(', ')
    } else {
      return '';
    }

  }

}

