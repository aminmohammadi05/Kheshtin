import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
// import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { PageImages } from 'src/app/models/page-images';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { OfficeProjectImage } from 'src/app/models/office-project-image';
import { ProductFile } from 'src/app/models/product-file';
import { AuthService } from 'src/app/services/auth.service';
import { Product } from 'src/app/models/product';
import { MoodBoardProduct } from 'src/app/models/moodboard-product';
import { UserMoodBoardCandidateProduct } from 'src/app/models/user-mood-board-candidate-product';
import * as uuid from 'uuid';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-mood-board-products-carousel',
  templateUrl: './mood-board-products-carousel.component.html',
  styleUrls: ['./mood-board-products-carousel.component.scss']
})
export class MoodBoardProductsCarouselComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() slides: Observable<Product[]>;
  @Input() candidateSlides: Observable<UserMoodBoardCandidateProduct[]>;
  @Input() isCandidateProducts: boolean;
  @Input() moodBoardId: string;
  @Input() currentProducts: Array<Product>;
  @Input() pageNumber: number;
  // public config: SwiperConfigInterface = {};
  public currentSlide: Product;
  @Input() selectedProducts: MoodBoardProduct[] = [];
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public authService: AuthService,
              public cdr: ChangeDetectorRef,
              public route: Router) {
    this.settings = this.appSettings.createNew()
  }

  ngOnInit() {

    this.slides.subscribe(x => {
      this.currentSlide =  x[this.pageNumber];
    });
  }

  ngAfterViewInit() {
    this.initCarousel();
  }

  ngOnChanges() {
    this.slides.subscribe(x => {
      this.currentSlide =  x[this.pageNumber];
    });
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

  public onIndexChange(event) {
    this.slides.subscribe(x => {
      this.currentSlide =  x[event];
    });
  }

  public addToMoodBoard(product: Product) {
    this.currentProducts.push(product);
    this.selectedProducts.push({
      productId: product.productId,
      layerIndex: this.selectedProducts.length + 1001,
      cols: 2,
      rows: 5,
      fileType: 12,
      x: 1,
      y: 1,
      productFileId: 1,
      moodBoardId: this.moodBoardId,
      createUserId: this.authService.getDecodedToken().nameid,
      product: null,
      moodBoardProduct: null
    });
  }

  public chooseColor(file) {

  }
  getProductFilesColors(product: Product) {
    return product.productFiles.filter(x => x.fileType === 12).map(x => x.color);
  }
  public getCategoriesNames() {
    if (this.currentSlide) {
      // return this.store.pipe(
      //   select(getCategoryListById(this.currentSlide.productCategoryList.filter(x => x.display).map(x => x.categoryId))),
      // map((cats) => {
      //   if (cats && cats[0]) {
      //     return cats.map(y => y.name).join(', ');
      //   }
      // }));
    } else {
      return of('');
    }

  }
  public getBrandName() {
    if (this.currentSlide) {
      // return this.store.pipe(select(getBrandById(this.currentSlide.brandProductCollectionList[0].brandCollection.brandId)),
      // map((brand) => {
      //   if (brand) {
      //     return brand.name;
      //   }
      // }));
    } else {
      return of('');
    }

  }
}
