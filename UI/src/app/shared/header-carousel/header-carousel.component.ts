import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { filter, map, switchMap, take, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { PageImages } from '../../models/page-images';
import { HomeCarousel } from '../../models/home-carousel';
import { BasicDataService } from '../../services/basic-data.service';

declare var $: any;
@Component({
  selector: 'app-header-carousel',
  templateUrl: './header-carousel.component.html',
  styleUrls: ['./header-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatCardModule, FlexLayoutModule, ReactiveFormsModule, SlickCarouselModule ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class HeaderCarouselComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
 
  @Input()
  pageNumber!: number;
  @Input()
  contentOffsetToTop: boolean = false;
  @Input('title') title: any;
  // public config: SwiperConfigInterface = {};
  public currentSlide: PageImages = new PageImages;
  public currentIndex = 0;
  public settings: Settings;
  public slides: HomeCarousel[] = [];
  constructor(public appSettings: AppSettings,
              public basicDataService: BasicDataService,
              private cdRef: ChangeDetectorRef,
              public route: Router) {
    this.settings = this.appSettings.createNew()
  }

  ngOnInit() {
    this.basicDataService.getHomeCarouselList().subscribe((x) => {
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
