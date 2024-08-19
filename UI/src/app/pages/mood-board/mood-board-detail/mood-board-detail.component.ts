import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList, Renderer2, ChangeDetectorRef} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Meta } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import {  } from 'ngx-scrollbar';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Observable, of } from 'rxjs';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Product } from 'src/app/models/product';
import { UserMoodBoard } from 'src/app/models/user-moodboard';
import { AuthService } from 'src/app/services/auth.service';
import { MoodBoardService } from 'src/app/services/mood-board.service';
import * as uuid from 'uuid';
import * as moment from 'jalali-moment'; // add this 1 of 4
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SmallProductItemComponent } from 'src/app/shared/small-product-item/small-product-item.component';

@Component({
  selector: 'app-mood-board-detail',
  templateUrl: './mood-board-detail.component.html',
  styleUrls: ['./mood-board-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatCardModule, MatButtonModule, FlexLayoutModule, MatFormFieldModule, MatSidenavModule, SmallProductItemComponent ]
})
export class MoodBoardDetailComponent implements OnInit, OnDestroy, AfterViewInit {
  viewType: string = 'grid';
  viewCol: number = 25;
  @ViewChild('sidenav', { static: true }) sidenav: ElementRef;
  @ViewChild('stickyCard', { static: true }) stickyCard: ElementRef;
  @ViewChild('delimiter', { static: true }) delimiter: ElementRef;
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  public config: SwiperConfigInterface = {};
  public config2: SwiperConfigInterface = {};
  private sub: any;
  public moodBoard: Observable<UserMoodBoard>;
  public settings: Settings;
  public embedVideo: any;
 
  public productIdList: Observable<string[]>;
  public productList: Observable<Product[]>;


  moodBoardId: string;
  projectImage: string;
  constructor(public appSettings: AppSettings,
              private activatedRoute: ActivatedRoute,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private renderer: Renderer2,
              private cdr: ChangeDetectorRef,
              public infoReq: MatDialog,
              public moodBoardService: MoodBoardService,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      var pattern=/^MBR-\d{6}$/;
      if (pattern.test(params.moodBoardId)) {
        this.moodBoardId = params.moodBoardId;
        this.getMoodBoard(this.moodBoardId);
        // this.moodBoard = this.store.pipe(select(getMoodBoardByDisplayId(this.moodBoardId)));
      } else {
        this.router.navigate(['/**']);
      }
    });

  }

  openZoom(event: any, show: boolean) {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  // @HostListener("window:scroll", ['$event'])
  // onWindowScroll($event:any) {
  //   if (this.delimiter && this.delimiter.nativeElement && this.stickyCard && this.stickyCard.nativeElement) {
  //     let top = window.pageYOffset ;
  //     let delimiterTop = this.delimiter.nativeElement.getBoundingClientRect().top; 
  //     if (top > delimiterTop) {
  //       this.renderer.removeClass(this.stickyCard.nativeElement, 'sticky-mat-sidenav');
  //       this.renderer.addClass(this.stickyCard.nativeElement, 'bottom-of-sidenav');
  //     } else {

  //       this.renderer.removeClass(this.stickyCard.nativeElement, 'bottom-of-sidenav');
  //       this.renderer.addClass(this.stickyCard.nativeElement, 'sticky-mat-sidenav');
  //     }
  //   }
  // }
  public getMoodBoard(id) {
    // if (this.authService.loggedIn()) {
    //   this.store.dispatch(new OneMoodBoardAuthRequest(id, this.authService.getDecodedToken().nameid));
    // } else {
    //   this.store.dispatch(new OneMoodBoardRequest(id));
    // }
    setTimeout(() => {
      this.config.observer = true;
      this.config2.observer = true;
      this.swipers.forEach(swiper => {
        if (swiper) {
          swiper.setIndex(0);
        }
      });
    });

  }

  ngAfterViewInit() {
    this.config = {
      observer: false,
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      }
    };

    this.config2 = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 16,
      keyboard: true,
      navigation: false,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    };
   
    this.cdr.detectChanges();
    // this.productIdList = this.store.pipe(select(getMoodBoardProductListByDisplayId(this.moodBoardId)));
    // this.productIdList.subscribe(productIdList => {
    //   if (productIdList && productIdList.length > 0) {
    //     this.productList = this.store.pipe(select(getProductListById(productIdList)));
    //     this.productList.subscribe(products => {
    //       if(products && products.length !== productIdList.length) {
    //         if (this.authService.loggedIn()) {
    //           this.store.dispatch(new GetProductByIdListAuthRequest(this.authService.getDecodedToken().nameid, productIdList));
    //         } else {
    //           this.store.dispatch(new GetProductByIdListRequest(productIdList));
    //         }
    //       }
    //       this.cdr.detectChanges();
    //     });
    //   }
    // });

  }


  public onOpenedChange() {
    this.swipers.forEach(swiper => {
      if (swiper) {
        swiper.update();
      }
    });
  }

  // public selectImage(index: number) {
  //   this.swipers.forEach(swiper => {
  //     if (swiper['elementRef'].nativeElement.id === 'main-carousel') {
  //       swiper.setIndex(index);
  //     }
  //   });
  // }
  
  

  public onIndexChange(index: number) {
    this.swipers.forEach(swiper => {
      const elem = swiper['elementRef'].nativeElement;
      if (elem.id === 'small-carousel') {
        swiper.setIndex(index);
        for(let i = 0; i < elem.children[0].children.length; i++) {
          const element = elem.children[0].children[i];
          if (element.classList.contains('thumb-' + index)) {
            element.classList.add('active-thumb');
          } else {
            element.classList.remove('active-thumb');
          }
        }
      }
    });
  }


  public changeDateToFa(date) {
    if (date) {
      const cdate = moment(date).locale('fa').format('YYYY/MM/DD');
      return of(cdate);
    }
  }


}


