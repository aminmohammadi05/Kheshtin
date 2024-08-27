import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input, 
  inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { } from 'ngx-scrollbar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { AppSettings, Settings } from '../../../app.settings';
import { OneOfficeVideoSearch } from '../../../models/one-office-video-search';
import { Pagination } from '../../../models/pagination';
import { AuthService } from '../../../services/auth.service';
import { DesignOfficeService } from '../../../services/design-office.service';
import { DesignOfficeVideoItemComponent } from '../../../shared/design-office-video-item/design-office-video-item.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-design-office-videos',
  templateUrl: './design-office-videos.component.html',
  styleUrls: ['./design-office-videos.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, FlexLayoutModule, MatProgressSpinnerModule, DesignOfficeVideoItemComponent, PaginationComponent],
})
export class DesignOfficeVideosComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() designOffice: any;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };

  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  public designOfficeVideos: any[] = [];
  public totalVideos!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public isLoading = false;
  public searchFields = new OneOfficeVideoSearch({
    searchId: 1,
    designerId: '',
    searchBox: '',
    pageQuery: new Pagination(0, 12, 0, 0)
  });
  public message!: string;
  public watcher!: Subscription;

  public settings: Settings;
  public appSettings = inject(AppSettings);
  public designOfficeService= inject(DesignOfficeService);
  private authService= inject(AuthService);
  private activatedRoute= inject(ActivatedRoute);
  private router= inject(Router);
  private cdRef= inject(ChangeDetectorRef);
  public fb= inject( FormBuilder);
  private route= inject( ActivatedRoute);
 
  private meta= inject( Meta);
  constructor(
              ) {
    this.settings = this.appSettings.createNew();
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
          pageQuery: new Pagination(+x["page"], 12, 0, 0)
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
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
  }



  public changeCount(count: number) {
    this.count = count;
    this.resetPagination();
    this.getDesignOfficeVideos();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    this.getDesignOfficeVideos();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.searchFields = new OneOfficeVideoSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    this.router.navigate(['/designoffices',this.designOffice.contentItemId,1, this.searchFields.pageQuery.currentPage + 1,  this.designOffice.displayText]);
    window.scrollTo(0, 0);
  }

  public getDesignOfficeVideos() {
   
  }

}
