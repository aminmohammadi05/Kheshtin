import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input, 
  inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { AppSettings, Settings } from '../../../app.settings';
import { BrandVideoSearch } from '../../../models/brand-video-search';
import { Pagination } from '../../../models/pagination';
import { AuthService } from '../../../services/auth.service';
import { BrandVideoDataSource } from '../../../services/brand-video-data-source';
import { BrandService } from '../../../services/brand.service';
import { ProductsService } from '../../../services/products.service';
import { BrandVideoItemComponent } from '../../../shared/brand-video-item/brand-video-item.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-videos',
  templateUrl: './videos.component.html',
  styleUrls: ['./videos.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatFormFieldModule, MatCardModule, MatProgressSpinnerModule, ReactiveFormsModule, PaginationComponent, BrandVideoItemComponent]
})
export class VideosComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() brand: any;
  @Input()
  tabChanged!: Subject<number>;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };

  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  public brandVideos: any[] = [];
  public brandAllVideos: any[] = [];
  public totalVideos!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public isLoading = false;
  public message!: string;
  public watcher!: Subscription;

  public settings: Settings;
  public searchFields = new BrandVideoSearch({
    searchId: 1,
    searchBox: 'filter=',
    pageQuery: new Pagination(0, 12, 0, 0)
  });
  dataSource!: BrandVideoDataSource;
  public appSettings= inject( AppSettings);
  private activatedRoute= inject( ActivatedRoute);
  
  public fb= inject( FormBuilder);
  private route= inject( ActivatedRoute);
  private router= inject( Router);
  private productService= inject( ProductsService);
  private brandService= inject( BrandService);
  private cdRef= inject( ChangeDetectorRef);
  private authService= inject( AuthService);
  private meta= inject( Meta);
  constructor() {
    this.settings = this.appSettings.createNew()
}

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe(x => {
      if(+x["tab"] !== 3)  {
        return;
      }
      if (+x["page"]) {
        this.searchFields = new BrandVideoSearch({
          searchId: 1,
          brandId: this.brand.contentItemId,
          searchBox: 'filter=',
          pageQuery: new Pagination(+x["page"], 12, 0, 0)
        });
        
        this.brandService.getVideosByBrandId(this.searchFields, `{from: ${(+x["page"] - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${this.brand.contentItemId}'}`).subscribe((y:any) => {
        
          this.searchFields.pageQuery.totalItems = y[0].count
          this.message = y[0].count === 0 ? "موردی یافت نشد" : '';
          this.brandVideos = y[1].getVideoByBrandId;
          this.isLoading = false;
        });
      }
    });
   
    // this.tabChanged.subscribe(x => {
    //   if (x === 3) {
    //     this.isLoading = true;
    //     this.searchFields = new BrandVideoSearch({
    //       searchId: 1,
    //       brandId: this.brand.contentItemId,
    //       searchBox: 'filter=',
    //       pageQuery: new Pagination(0, 12, null, null)
    //     });
    //     this.brandVideoService.getAllBrandVideos(this.searchFields, `{from: ${this.searchFields.pageQuery.itemsPerPage * this.searchFields.pageQuery.currentPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext:'${this.searchFields.brandId}'}`).subscribe(x => {
        
    //       this.searchFields.pageQuery.totalItems = x[0].count;
    //       this.message = x[0].count === 0 ? "موردی یافت نشد" : '';
    //       this.brandVideos = x[1].getVideoByBrandId;
    //       this.isLoading = false;
    //     })
    //   }
    // });
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
    this.searchFields = new BrandVideoSearch({
      searchId: 1,
      searchBox: 'filter=',
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
  }



  public changeCount(count: number) {
    this.count = count;
    this.brandVideos.length = 0;
    this.resetPagination();
    this.getBrandVideos();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    this.brandVideos.length = 0;
    this.getBrandVideos();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.searchFields = new BrandVideoSearch({
      searchId: 1,
      searchBox: 'filter=',
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    this.router.navigate(['/brands',  this.brand.contentItemId, 2, e.pageIndex + 1, this.brand.displayText]);
    window.scrollTo(0, 0);
  }

  public getBrandVideos() {
    this.dataSource.loadBrandVideos();
  }

}
