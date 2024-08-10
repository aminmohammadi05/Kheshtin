import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AppService } from 'src/app/app.service';
import { ProductFile } from 'src/app/models/product-file';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product-files',
  templateUrl: './product-files.component.html',
  styleUrls: ['./product-files.component.scss']
})
export class ProductFilesComponent implements OnInit, AfterViewInit {
  @Input() productFiles: ProductFile[];
  public config: SwiperConfigInterface = { };
  constructor(public appService: AppService,
              public authService: AuthService
              ) { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 7,
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
      effect: 'slide',
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
    };
  }

}
