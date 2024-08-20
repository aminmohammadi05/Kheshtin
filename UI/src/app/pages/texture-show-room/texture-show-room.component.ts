import { Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList, OnDestroy, AfterViewInit, HostListener, ElementRef, ViewEncapsulation, Input, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';

import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';

import { tap } from 'rxjs/operators';

import * as uuid from 'uuid';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

declare let html2canvas: any;


import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { ShowRoomProduct } from '../../models/show-room-product';
import { AppSettings, Settings } from '../../app.settings';
import { Brand } from '../../models/brand';
import { TextureShowRoom } from '../../models/texture-show-room';
import { ShowRoomService } from '../../services/show-room.service';
import { AuthService } from '../../services/auth.service';
import { emailValidator } from '../../theme/utils/app-validators';

@Component({
  selector: 'app-texture-show-room',
  templateUrl: './texture-show-room.component.html',
  styleUrls: ['./texture-show-room.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatExpansionModule,  FlexLayoutModule, MatDividerModule],
  encapsulation: ViewEncapsulation.None
})
export class TextureShowRoomComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild('sidenav', { static: true })
  sidenav!: ElementRef;
  @ViewChild('stickyCard', { static: true })
  stickyCard!: ElementRef;
  @ViewChild('delimiter', { static: true })
  delimiter!: ElementRef;
  @ViewChild('screen', { static: true }) screen: any;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;

  public viewType = 'grid';
  public viewCol = 33.3;
  img = '';
  public sidenavOpen = true;
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  private sub: any;
  public product: ShowRoomProduct = new ShowRoomProduct;
  public settings: Settings;
  public embedVideo: any;
  public mortgageForm!: FormGroup;
  public monthlyPayment: any;
  public contactForm!: FormGroup;
  public bottom = 0;
  public brand!: Observable<Brand>;
  public brands!: Observable<Brand[]>;
  public textureList!: ShowRoomProduct[];
  public createdTexture!: TextureShowRoom;

  public showProducersDialog = false;
  public showProductsDialog = false;
  public showBondingsDialog = false;
  public showBondingColorsDialog = false;
  

  public textureOrder = [{orderId: 1, image: '../../assets/orders/1.png'},
                         {orderId: 2, image: '../../assets/orders/2.png'},
                         {orderId: 3, image: '../../assets/orders/3.png'},
                         {orderId: 4, image: '../../assets/orders/4.png'},
                         {orderId: 5, image: '../../assets/orders/5.png'},
                         {orderId: 6, image: '../../assets/orders/6.png'}];
  public textureColor = [{colorId: 1, color: '#ffffff'},
                         {colorId: 2, color: '#010101'},
                         {colorId: 3, color: '#999999'},
                         {colorId: 4, color: '#545784'},
                         {colorId: 5, color: '#603814'},
                         {colorId: 6, color: '#b95e49'},
                         {colorId: 7, color: '#4d4d4d'},
                         {colorId: 8, color: '#998675'},
                         {colorId: 9, color: '#c9b199'}];

  productId!: string;
  brandId!: string;
  productImage!: string;
  selectedTexture: ShowRoomProduct = new ShowRoomProduct;
  selectedOrder = 1;
  selectedColor: any;
  capturedImage: any;
  private dialogRef!: MatDialogRef<TextureShowRoomDownloadDialogComponent>;
  constructor(public appSettings: AppSettings,
              
              private showRoomService: ShowRoomService,
              private activatedRoute: ActivatedRoute,
              public dialog: MatDialog,
              public fb: FormBuilder,
              public authService: AuthService,
              public infoReq: MatDialog,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() {
    this.selectedColor = this.textureColor.filter(x => x.colorId === 1)[0];
    // this.brands = this.store.pipe(select(getBrandsForAppId(1)));
    this.activatedRoute.params.subscribe(params => {
      if (params['brandId'] && uuid.validate(params['brandId'])) {
        if (params['productId'] && uuid.validate(params['productId'])) {
          this.productId = params['productId'];
        }
        this.brandId = params['brandId'];
        this.getBrandTextureProductsById(this.brandId);
      } else {
        this.brands.subscribe(b => {
          if (b && b.length > 0) {
            this.brandId = b[0].brandId;
            this.getBrandTextureProductsById(this.brandId);
          }
        });
      }

      
    });

    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
      // this.sidenav.close();
    }
    this.mortgageForm = this.fb.group({
      principalAmount: ['', Validators.required],
      downPayment: ['', Validators.required],
      interestRate: ['', Validators.required],
      period: ['', Validators.required]
    });
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  openZoom(event: any, show: boolean) {
  }

  ngOnDestroy() {
    
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }
  public selectOrder(id: number) {
    this.selectedOrder = id;
  }

  public selectColor(id: number) {
    this.selectedColor = this.textureColor.filter(x => x.colorId === id)[0];
  }
  public selectTexture(texture: ShowRoomProduct) {
  
    this.selectedTexture = texture;
  }
  public getProductFileId(selectedOrder: number) {
    return this.selectedTexture && this.selectedTexture.productFiles.filter(x => x.reservedField1 === selectedOrder)[0] ?
            this.selectedTexture.productFiles.filter(x => x.reservedField1 === selectedOrder)[0].productFileId : 1;
  }

  public getBrandTextureProductsById(id: string) {
    this.textureList = [];
    this.selectedTexture;
    this.getBrand(id);
    // this.store.pipe(select(getBrandTextureShowRoomProductsById(id)),
    // tap(product => {
    //   if (product && product.length > 0) {
    //     this.textureList = product;
    //     if (!this.productId) {
    //       this.selectedTexture = this.textureList[0];
    //     }
    //     this.meta
    //     .addTags([{name: 'keywords',
    //      content: product.map(x => x.keywordList) ?
    //       product.map(x => x.keywordList.replace('&', ',')).join(',') + ',' + product.map(x => x.name).join(',') : ''}
    //     ]);
    //     setTimeout(() => {
    //       this.config.observer = true;
    //       this.config2.observer = true;
    //       this.swipers.forEach(swiper => {
    //         if (swiper) {
    //           swiper.setIndex(0);
    //         }
    //       });
    //     });
    //   } else {
    //     if (this.authService.loggedIn()) {
    //       this.store.dispatch(new GetBrandTextureShowRoomProductsAuthRequest(this.authService.getDecodedToken().nameid, id));
    //     } else {
    //       this.store.dispatch(new GetBrandTextureShowRoomProductsRequest(id));
    //     }
    //   }
    // })).subscribe();
  }
  
  public changeSelectedBrand(brand: Brand) {
    this.brandId = brand.displayId;
    this.getBrandTextureProductsById(brand.brandId);
  }


  ngAfterViewInit() {
    // this.config = {
    //   observer: false,
    //   slidesPerView: 1,
    //   spaceBetween: 0,
    //   keyboard: true,
    //   navigation: true,
    //   pagination: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false
    //   }
    // };

    // this.config2 = {
    //   observer: false,
    //   slidesPerView: 7,
    //   spaceBetween: 16,
    //   keyboard: true,
    //   navigation: false,
    //   pagination: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   breakpoints: {
    //     480: {
    //       slidesPerView: 2
    //     },
    //     600: {
    //       slidesPerView: 3,
    //     }
    //   }
    // };

  }


  public onOpenedChange() {
    // this.swipers.forEach(swiper => {
    //   if (swiper) {
    //     swiper.update();
    //   }
    // });
  }

  public selectImage(index: number) {
    // this.swipers.forEach(swiper => {
    //   if (swiper['elementRef'].nativeElement.id === 'main-carousel') {
    //     swiper.setIndex(index);
    //   }
    // });
  }

  public onIndexChange(index: number) {
    // this.swipers.forEach(swiper => {
    //   const elem = swiper['elementRef'].nativeElement;
    //   if (elem.id === 'small-carousel') {
    //     swiper.setIndex(index);
    //     for(let i = 0; i < elem.children[0].children.length; i++) {
    //       const element = elem.children[0].children[i];
    //       if (element.classList.contains('thumb-' + index)) {
    //         element.classList.add('active-thumb');
    //       } else {
    //         element.classList.remove('active-thumb');
    //       }
    //     }
    //   }
    // });
  }
  public getBrand(brandId: string) {
    // this.brand = this.store.select(getBrandById(brandId));
  }
  public downloadTexture() {
    this.createdTexture = new TextureShowRoom({
      productId: this.selectedTexture.productId,
      productFileId: this.getProductFileId(this.selectedOrder) ,
      orientation: this.selectedOrder,
      bondingColor: this.selectedColor.colorId,
      // createUserId: this.authService.getDecodedToken().nameid,
    });
    this.showRoomService.createShowRoomAuth(undefined, this.createdTexture).subscribe(showRoom => {
      this.dialogRef = this.dialog.open(TextureShowRoomDownloadDialogComponent, {
        panelClass: 'calendar-form-dialog',
        data: {
          action: 'edit',
          showRoom: this.createdTexture
        },
        width: '800px'
      });
      this.dialogRef.afterClosed()
        .subscribe((res) => {
          if (!res) {
            return;
          }

        });

    });
  }

  public captureImage() {
    html2canvas(this.screen.nativeElement, {removeContainer: true}).then((canvas: { toBlob: (arg0: (blob: any) => void, arg1: string) => void; }) => {
      // Convert the canvas to blob
      canvas.toBlob((blob: Blob | MediaSource) => {
          // To download directly on browser default 'downloads' location
          const link = document.createElement('a');
          link.download = 'image.png';
          link.href = URL.createObjectURL(blob);
          link.click();
          const url = window.URL.createObjectURL(blob);
          window.open(url);
          // To save manually somewhere in file explorer

      }, 'image/png');
  });
  }
}


@Component({
  selector: 'app-texture-show-room-download-dialog',
  templateUrl: 'texture-show-room-download-dialog.html',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatExpansionModule,  FlexLayoutModule, MatDividerModule],
})
export class TextureShowRoomDownloadDialogComponent implements OnInit {
  public settings: Settings;
  public selectedIndex = 1;
  public selectedImageId!: number;
  showRoom!: TextureShowRoom;
  @Input() variant = 1;
  reqform!: FormGroup;
  constructor(public appSettings: AppSettings,
              public authService: AuthService,
              public dialogRef: MatDialogRef<TextureShowRoomDownloadDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: TextureShowRoomData,
              public fb: FormBuilder) {
      this.settings = this.appSettings.settings;
}
ngOnInit() {
  this.showRoom = this.data.showRoom;

}
// selectImage(index) {
//   this.selectedIndex = index;
//   let image = null;
//   this.selectedImageId = this.product.productFiles[index].productFileId;
// }
public getAppearance() {
  return (this.variant !== 3) ? 'outline' : '';
}
public getFloatLabel() {
  return (this.variant === 1) ? 'always' : '';
}
save() {
  this.dialogRef.close({action: 'save', selectedShowRoom: this.showRoom});
}
close() {
  this.dialogRef.close({action: 'delete'});
}

}

export interface TextureShowRoomData {
  showRoom: TextureShowRoom;
}