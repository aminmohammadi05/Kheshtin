import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { PageImages } from 'src/app/models/page-images';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { EventImage } from 'src/app/models/event-image';

@Component({
  selector: 'app-event-header-carousel',
  templateUrl: './event-header-carousel.component.html',
  styleUrls: ['./event-header-carousel.component.scss']
})
export class EventHeaderCarouselComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() slides: Array<EventImage>;
  @Input() pageNumber: number;
  @Input() contentOffsetToTop;
  public config: SwiperConfigInterface = {};
  public currentSlide: EventImage;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              private cdr: ChangeDetectorRef,
              public route: Router) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    if (this.contentOffsetToTop) {
      this.settings.contentOffsetToTop = this.contentOffsetToTop;
      this.cdr.detectChanges();
    }
    this.currentSlide = this.slides[this.pageNumber];
  }

  ngAfterViewInit() {
    this.initCarousel();
  }

  ngOnChanges() {
    this.currentSlide = this.slides[this.pageNumber];
  }

  public initCarousel() {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: false,
      speed: 500,
      effect: 'slide'
    };
  }

  ngOnDestroy() {
    this.settings.contentOffsetToTop = false;
  }

  public onIndexChange(index: number) {
    this.currentSlide = this.slides[index];
  }
  
}
