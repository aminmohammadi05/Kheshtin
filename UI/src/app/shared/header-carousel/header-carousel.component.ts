import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { PageImages } from 'src/app/models/page-images';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { LazyLoadScriptService } from 'src/app/services/lazy-load-script-service';
import { BasicDataService } from 'src/app/services/basic-data.service';

declare var $;
@Component({
  selector: 'app-header-carousel',
  templateUrl: './header-carousel.component.html',
  styleUrls: ['./header-carousel.component.scss']
})
export class HeaderCarouselComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
 
  @Input() pageNumber: number;
  @Input() contentOffsetToTop;
  @Input('title') title;
  public config: SwiperConfigInterface = {};
  public currentSlide: PageImages;
  public currentIndex = 0;
  public settings: Settings;
  public slides: [];
  constructor(public appSettings: AppSettings,
              public basicDataService: BasicDataService,
              private cdRef: ChangeDetectorRef,
              public route: Router) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.basicDataService.getHomeCarouselList().subscribe(x => {
      this.slides = x.homeCarousel
    });
    if (this.contentOffsetToTop) {
      this.settings.contentOffsetToTop = this.contentOffsetToTop;
      this.cdRef.detectChanges();
    }
  }

  ngAfterViewInit() {
    
  }
  ngAfterContentInit() {
   
  }
  ngOnChanges() {
   
  }

  slideConfig = { slidesToShow: 1, slidesToScroll: 1, rtl: true, autoplay:false };
  
  slickInit(e: any) {
   
  }
  breakpoint(e: any) {
   
  }
  afterChange(e: any) {
   
  }
  beforeChange(e: any) {
   
  }

  ngOnDestroy() {
    this.settings.contentOffsetToTop = false;
  }

  public onIndexChange(index: number) {
    
  }
  navigateToBrand() {
  
    
  }
}
