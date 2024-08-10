import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Event } from 'src/app/models/event';

@Component({
  selector: 'app-events-carousel',
  templateUrl: './events-carousel.component.html',
  styleUrls: ['./events-carousel.component.scss']
})
export class EventsCarouselComponent implements OnInit, AfterViewInit {
  @Input() officeProjects: Array<Event> = [];
  public config: SwiperConfigInterface = {};
  @Input() viewType: string = 'grid';
  @Input() viewCol: number = 25;
  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 4,
      spaceBetween: 16,
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
