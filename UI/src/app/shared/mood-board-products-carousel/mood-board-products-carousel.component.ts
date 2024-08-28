import { Component, OnInit, Input, ViewChild, OnDestroy, AfterViewInit, OnChanges, ChangeDetectorRef } from '@angular/core';
// import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { Settings, AppSettings } from '../../app.settings';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { MoodBoardProduct } from '../../models/moodboard-product';
import { Product } from '../../models/product';
import { UserMoodBoardCandidateProduct } from '../../models/user-mood-board-candidate-product';
import { AuthService } from '../../services/auth.service';
import { ProductFile } from '../../models/product-file';
import { UserMoodBoard } from '../../models/user-moodboard';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-mood-board-products-carousel',
  templateUrl: './mood-board-products-carousel.component.html',
  styleUrls: ['./mood-board-products-carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, MatCardModule, MatButtonModule]
})
export class MoodBoardProductsCarouselComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input()
  slides!: Observable<Product[]>;
  @Input()
  candidateSlides!: Observable<UserMoodBoardCandidateProduct[]>;
  @Input()
  isCandidateProducts!: boolean;
  @Input()
  moodBoardId!: string;
  @Input()
  currentProducts!: Array<Product>;
  @Input()
  pageNumber!: number;
  // public config: SwiperConfigInterface = {};
  public currentSlide!: Product;
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

  public onIndexChange(event: string | number) {
    this.slides.subscribe(x => {
      // this.currentSlide =  x[event];
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
      product: new ProductFile(),
      moodBoardProduct: new UserMoodBoard()
    });
  }

  public chooseColor(file: any) {

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
