import { Component, OnInit, Input, ViewChild, SimpleChange, AfterViewInit, OnChanges } from '@angular/core';
import { SwiperDirective, SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';

import { AppService } from '../../app.service';
import { CompareOverviewComponent } from '../compare-overview/compare-overview.component';
import { OfficeProject } from 'src/app/models/office-project';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-office-project-item',
  templateUrl: './office-project-item.component.html',
  styleUrls: ['./office-project-item.component.scss']
})
export class OfficeProjectItemComponent implements OnInit, AfterViewInit, OnChanges {
  @Input() project: any;
  @Input() viewType = 'grid';
  @Input() viewColChanged = false;
  @Input() fullWidthPage = true;
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
        if (this.project.officeProjectImageList.length > 1) {
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
  getOfficeProjectImages(project){
    return project.bag.contentItems.filter(x => x.__typename === "ProjectImage");
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
  public getDesignOfficeName() {
    if (this.project) {
      return this.project.designOffice.contentItems.map(x => x.displayText).join(', ')
    } else {
      return '';
    }

  }
  public getCategoriesNames() {
    if (this.project) {
     
      return this.project.projectType.contentItems.map(x => x.displayText).join(', ')
    } else {
      return '';
    }

  }

}
