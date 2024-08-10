import { Component, Input, OnInit } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AppService } from 'src/app/app.service';
import { Observable } from 'rxjs';
import { Brand } from 'src/app/models/brand';

@Component({
  selector: 'app-brands-carousel',
  templateUrl: './brands-carousel.component.html',
  styleUrls: ['./brands-carousel.component.scss']
})
export class BrandsCarouselComponent implements OnInit {
  @Input() public brands: any[];
  public config: SwiperConfigInterface = { };
  constructor(public appService: AppService) { }

  ngOnInit() {
    // this.brands = this.store.pipe(select(getAllBrands));
  }

  ngAfterViewInit(){
    this.config = {
      observer: true,
      slidesPerView: 9,
      spaceBetween: 16,       
      keyboard: true,
      navigation: false,
      pagination: false,
      grabCursor: true,        
      loop: false,
      preloadImages: false,
      lazy: true,  
      autoplay: {
        delay: 6000,
        disableOnInteraction: false
      },
      speed: 500,
      effect: "slide",
      breakpoints: {
        320: {
          slidesPerView: 1
        },
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        },
        960: {
          slidesPerView: 4,
        },
        1280: {
          slidesPerView: 5,
        },
        1500: {
          slidesPerView: 6,
        }
      }
    }
  }

}