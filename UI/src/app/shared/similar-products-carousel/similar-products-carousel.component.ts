import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-similar-products-carousel',
  templateUrl: './similar-products-carousel.component.html',
  styleUrls: ['./similar-products-carousel.component.scss']
})
export class SimilarProductsCarouselComponent implements OnInit, AfterViewInit {
  @Input() products: Array<any> = [];
  public config: SwiperConfigInterface = {};
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 20;
  @Input() slides: number = 5;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: this.slides,
      spaceBetween: 32,
      keyboard: true,
      navigation: { nextEl: '.prop-next', prevEl: '.prop-prev'},
      pagination: true,
      grabCursor: true,
      loop: false,
      preloadImages: true,
      lazy: false,
      breakpoints: {
        600: {
          slidesPerView: 1
        },
        960: {
          slidesPerView: 2,
        },
        1280: {
          slidesPerView: 3,
        }
      }
    };
  }

}
