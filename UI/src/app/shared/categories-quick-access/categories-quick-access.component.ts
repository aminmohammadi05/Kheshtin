import { Component, OnInit, AfterViewInit, Renderer2, Output, ElementRef, ViewChildren, QueryList, EventEmitter, Input, ViewChild, inject } from '@angular/core';
import { Observable, Subject, Subscription, fromEvent, timer } from 'rxjs';
import { concatMap, debounceTime, distinctUntilChanged, map, repeat, takeUntil, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { CategoriesQuickAccessService } from './categories-quick-access.service';
import { Category } from '../../models/category';
import { BasicDataService } from '../../services/basic-data.service';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-categories-quick-access',
  templateUrl: './categories-quick-access.component.html',
  styleUrls: ['./categories-quick-access.component.scss'],
  standalone: true,
  imports: [CommonModule, MatProgressSpinnerModule]
})
export class CategoriesQuickAccessComponent implements OnInit, AfterViewInit {
  subscription = new Subscription();
  init = false;

  onHover = false;
  to: any;
  public clients: any;

  public categoryList = [];
  public mouseMoveSubscription: any;
  
  @ViewChildren('fb')
  fbButtons!: QueryList<any>;
  @Output() selectedCategory: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedCategoryForMenu: any;
  @Output() openProductsPart: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input()
  isLoadingDone!: boolean;
 
  // public config: SwiperConfigInterface = {
  //   observer: true,
  //   slidesPerView: 7,
  //   spaceBetween: 16,
  //   keyboard: true,
  //   navigation: false,
  //   pagination: false,
  //   grabCursor: true,
  //   loop: false,
  //   preloadImages: false,
  //   lazy: true,
  //   // autoplay: {
  //   //   delay: 6000,
  //   //   disableOnInteraction: false
  //   // },
  //   speed: 500,
  //   effect: 'slide',
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
  // };

  // @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public basicDataService= inject( BasicDataService);
  public categoryQuickAccessService= inject( CategoriesQuickAccessService);
  public router= inject( Router);
  constructor(
              ) { }

  ngOnInit() {
   this.basicDataService.getCategoriesQuickAccess().subscribe((x: { productCategory: any[]; }) => {
    this.categoryList = [];
    
    x.productCategory.map((x2: { childrenCategories: { contentItems: any[]; }; }) => {
      x2.childrenCategories.contentItems
      .map((x3: { image: { urls: any[]; }; }) => {
        if (x3.image && x3.image.urls[0]) {         
          // this.categoryList.push(x3);
        } 
      })
    })
    
   });
   
   
  }

  
  ngAfterViewInit() {
   
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
}
  openProductPage(category: Category) {
    this.router.navigate(['/products', 1, {search: 'null', brands: 'null', collections: 'null', categories: category.categoryId}]);
    
  }


  fire(e: any,key: any) {
    this.selectedCategory.emit(key)
    
  }
 
 
// categoryEnter( index: number) {
//   this.fbButtons.toArray().forEach((tr, i)=> {
//     const leave$ = fromEvent(tr.nativeElement, "mouseleave");
//     fromEvent(tr.nativeElement, 'mouseenter').pipe(takeUntil(leave$), debounceTime(1000))
//     .subscribe((e: MouseEvent) => {
//         if(index === i) {

//         }
        
//     });
//   });
// }

 
}
