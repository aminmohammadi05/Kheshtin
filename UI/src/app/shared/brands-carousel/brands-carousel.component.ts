import { Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
// import { SwiperConfigInterface } from 'ngx-swiper-wrapper';


@Component({
  selector: 'app-brands-carousel',
  templateUrl: './brands-carousel.component.html',
  styleUrls: ['./brands-carousel.component.scss'],
  standalone: true,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class BrandsCarouselComponent implements OnInit {
  @Input()
  public brands!: any[];
  // public config: SwiperConfigInterface = { };
  constructor() { }

  ngOnInit() {
    // this.brands = this.store.pipe(select(getAllBrands));
  }

  ngAfterViewInit(){
    // this.config = {
    //   observer: true,
    //   slidesPerView: 9,
    //   spaceBetween: 16,       
    //   keyboard: true,
    //   navigation: false,
    //   pagination: false,
    //   grabCursor: true,        
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,  
    //   autoplay: {
    //     delay: 6000,
    //     disableOnInteraction: false
    //   },
    //   speed: 500,
    //   effect: "slide",
    //   breakpoints: {
    //     320: {
    //       slidesPerView: 1
    //     },
    //     480: {
    //       slidesPerView: 2
    //     },
    //     600: {
    //       slidesPerView: 3,
    //     },
    //     960: {
    //       slidesPerView: 4,
    //     },
    //     1280: {
    //       slidesPerView: 5,
    //     },
    //     1500: {
    //       slidesPerView: 6,
    //     }
    //   }
    // }
  }

}