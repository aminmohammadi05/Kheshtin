import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Product } from 'src/app/models/product';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Blog } from 'src/app/models/blog';

@Component({
  selector: 'app-similar-blogs-carousel',
  templateUrl: './similar-blogs-carousel.component.html',
  styleUrls: ['./similar-blogs-carousel.component.scss']
})
export class SimilarBlogsCarouselComponent implements OnInit, AfterViewInit {
  @Input() blogs: Array<any> = [];
  public config: SwiperConfigInterface = {};
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 20;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      
      slidesPerView: 5,
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
