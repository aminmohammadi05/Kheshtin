import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { } from 'ngx-scrollbar';
import { Property } from 'src/app/app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';

import { CompareOverviewComponent } from 'src/app/shared/compare-overview/compare-overview.component';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Pagination } from 'src/app/models/pagination';
import { MatPaginator } from '@angular/material/paginator';
import { Category } from 'src/app/models/category';
import { Search } from 'src/app/models/search';
import { DesignOfficeVideo } from 'src/app/models/design-office-video';
import { DesignOffice } from 'src/app/models/design-office';
import { OneOfficeVideoDataSource } from 'src/app/services/one-office-video-data-source';
import { DesignOfficeVideoService } from 'src/app/services/design-office-video.service';
import { OneOfficeVideoSearch } from 'src/app/models/one-office-video-search';
import { DesignOfficeService } from 'src/app/services/design-office.service';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { DesignOfficeVideoItemComponent } from 'src/app/shared/design-office-video-item/design-office-video-item.component';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-design-office-videos',
  templateUrl: './design-office-videos.component.html',
  styleUrls: ['./design-office-videos.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, FlexLayoutModule, MatProgressSpinnerModule, DesignOfficeVideoItemComponent, PaginationComponent],
})
export class DesignOfficeVideosComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() designOffice: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };

  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  public designOfficeVideos: any[] = [];
  public totalVideos: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public isLoading = false;
  public searchFields = new OneOfficeVideoSearch({
    searchId: 1,
    designerId: '',
    searchBox: '',
    pageQuery: new Pagination(0, 12, null, null)
  });
  public message: string;
  public watcher: Subscription;

  public settings: Settings;
  

  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private activatedRoute: ActivatedRoute,
              
              public designOfficeService: DesignOfficeService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe(x => {
      if(+x["tab"] !== 1)  {
        return;
      }
      if (+x["page"]) {
        this.searchFields = new OneOfficeVideoSearch({
          searchId: 1,
          designerId: x["designOfficeId"],
          searchBox: 'filter=',
          pageQuery: new Pagination(+x["page"], 12, null, null)
        });
        
        this.designOfficeService.getVideosByOfficeId(this.searchFields, `{from: ${(+x["page"] - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${x["designOfficeId"]}'}`).subscribe((y:any) => {
       
          this.searchFields.pageQuery.totalItems = y[0].count
          this.message = y[0].count === 0 ? "موردی یافت نشد" : '';
          this.designOfficeVideos = y[1].getVideoByOfficeId;
          this.isLoading = false;
        });
      }
    });
  }

  openZoom(event: any, show: boolean) {
  }

  ngOnDestroy() {
  }


  ngAfterViewInit() {
    this.cdRef.detectChanges();
    // this.config = {
    //   observer: false,
    //   slidesPerView: 1,
    //   spaceBetween: 0,
    //   keyboard: true,
    //   navigation: true,
    //   pagination: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false
    //   }
    // };

    // this.config2 = {
    //   observer: false,
    //   slidesPerView: 4,
    //   spaceBetween: 16,
    //   keyboard: true,
    //   navigation: false,
    //   pagination: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   breakpoints: {
    //     480: {
    //       slidesPerView: 2
    //     },
    //     600: {
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
    this.searchFields = new OneOfficeVideoSearch({
      searchId: 1,
      designerId: this.designOffice.officeId,
      pageQuery: new Pagination(0, this.count, null, null)
    });
  }



  public changeCount(count) {
    this.count = count;
    this.resetPagination();
    this.getDesignOfficeVideos();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.getDesignOfficeVideos();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.searchFields = new OneOfficeVideoSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    this.router.navigate(['/designoffices',this.designOffice.contentItemId,1, this.searchFields.pageQuery.currentPage + 1,  this.designOffice.displayText]);
    window.scrollTo(0, 0);
  }

  public getDesignOfficeVideos() {
   
  }

}
