import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef, inject } from '@angular/core';
// import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProductFile } from '../../models/product-file';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-product-textures-header-carousel',
  templateUrl: './product-textures-header-carousel.component.html',
  styleUrls: ['./product-textures-header-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class ProductTexturesHeaderCarouselComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input()
  slides!: Array<ProductFile>;
  @Input()
  pageNumber!: number;
  @Input()
  contentOffsetToTop!: boolean;
  // public config: SwiperConfigInterface = {};
  public currentSlide!: ProductFile;
  public settings: Settings;
  public appSettings= inject( AppSettings);
              private cdRef= inject( ChangeDetectorRef);
              public authService= inject( AuthService);
              public route= inject( Router);
  constructor() {
    this.settings = this.appSettings.createNew()
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
    // this.config = {
    //   slidesPerView: 1,
    //   spaceBetween: 0,
    //   keyboard: true,
    //   navigation: true,
    //   pagination: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   autoplay: false,
    //   speed: 500,
    //   effect: 'slide'
    // };
  }

  ngOnDestroy() {
    this.settings.contentOffsetToTop = false;
  }

  public onIndexChange(index: number) {
    this.currentSlide = this.slides[index];
  }
  
}
