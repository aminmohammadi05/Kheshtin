import { Component, OnInit, ViewChild, OnDestroy, inject } from '@angular/core';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Product } from '../../models/product';
import { ProductsService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTreeModule } from '@angular/material/tree';
import { MatChipsModule } from '@angular/material/chips';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { ProductItemComponent } from '../../shared/product-item/product-item.component';

@Component({
  selector: 'app-compare',
  standalone: true,
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.scss'],
  imports: [CommonModule, MatChipsModule, MatListModule, MatButtonModule, MatIconModule, MatCardModule, ProductItemComponent],
})
export class CompareComponent implements OnInit, OnDestroy {
  // @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  // public config: SwiperConfigInterface = {};
  public watcher!: Subscription;
  public settings: Settings;
  public appSettings = inject (AppSettings);
              // public appService: AppService,
              public productService= inject ( ProductsService);
              public mediaObserver= inject ( MediaObserver);
  constructor() {
    this.settings = this.appSettings.createNew()
  }

  ngOnInit() {
    // this.config = {
    //   observer: true,
    //   slidesPerView: 4,
    //   spaceBetween: 16,
    //   keyboard: false,
    //   navigation: false,
    //   pagination: false,
    //   simulateTouch: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: true,
    //   lazy: false,
    //   breakpoints: {
    //     600: {
    //       slidesPerView: 1
    //     },
    //     960: {
    //       slidesPerView: 2,
    //     },
    //     1280: {
    //       slidesPerView: 3,
    //     }
    //   }
    // };
    this.watchForChanges();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  public disableSwiper() {
    setTimeout(() => {
      // if (this.directiveRef) {
      //   this.config.keyboard = false;
      //   this.config.navigation = false;
      //   this.config.simulateTouch = false;
      //   this.directiveRef.update();
      // }
    });
  }
  public enableSwiper() {
    setTimeout(() => {
      // if (this.directiveRef) {
      //   this.config.keyboard = true;
      //   this.config.navigation = { nextEl: '.carousel-next', prevEl: '.carousel-prev' };
      //   this.config.simulateTouch = true;
      //   this.directiveRef.update();
      // }
    });
  }

  public clear() {
    this.productService.Data.compareList.length = 0;
  }

  public remove(product: Product) {
    const index: number = this.productService.Data.compareList.indexOf(product);
    if (index !== -1) {
        this.productService.Data.compareList.splice(index, 1);
    }
    this.watchForChanges();
  }

  public watchForChanges() {
    // this.watcher = this.mediaObserver.media$.subscribe((change: MediaChange) => {
    //    if (change.mqAlias === 'xs' && this.productService.Data.compareList.length > 1) {
    //      this.enableSwiper();
    //    } else if (change.mqAlias === 'sm' && this.productService.Data.compareList.length > 2) {
    //      this.enableSwiper();
    //    } else if (change.mqAlias === 'md' && this.productService.Data.compareList.length > 3) {
    //      this.enableSwiper();
    //    } else if (change.mqAlias === 'lg' && this.productService.Data.compareList.length > 4) {
    //      this.enableSwiper();
    //    } else if (change.mqAlias === 'xl' && this.productService.Data.compareList.length > 4) {
    //      this.enableSwiper();
    //    } else {
    //      this.disableSwiper();
    //    }
    //  });
  }

}
