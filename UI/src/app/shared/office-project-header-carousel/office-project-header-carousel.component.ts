import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
import { Settings, AppSettings } from '../../app.settings';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { OfficeProjectImage } from '../../models/office-project-image';

@Component({
  selector: 'app-office-project-header-carousel',
  templateUrl: './office-project-header-carousel.component.html',
  styleUrls: ['./office-project-header-carousel.component.scss'],
  standalone: true,
  imports: []
})
export class OfficeProjectHeaderCarouselComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input()
  slides!: Array<OfficeProjectImage>;
  @Input()
  pageNumber!: number;
  @Input()
  contentOffsetToTop!: boolean;
 
  public currentSlide!: OfficeProjectImage;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              private cdr: ChangeDetectorRef,
              public route: Router) {
    this.settings = this.appSettings.createNew()
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
