import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { PageImages } from 'src/app/models/page-images';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { OfficeProjectImage } from 'src/app/models/office-project-image';
import { ProductFile } from 'src/app/models/product-file';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-textures-header-carousel',
  templateUrl: './product-textures-header-carousel.component.html',
  styleUrls: ['./product-textures-header-carousel.component.scss']
})
export class ProductTexturesHeaderCarouselComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() slides: Array<ProductFile>;
  @Input() pageNumber: number;
  @Input() contentOffsetToTop;
  public config: SwiperConfigInterface = {};
  public currentSlide: ProductFile;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              private cdRef: ChangeDetectorRef,
              public authService: AuthService,
              public route: Router) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {

    if (this.contentOffsetToTop) {
      this.settings.contentOffsetToTop = this.contentOffsetToTop;
      this.cdRef.detectChanges();
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
