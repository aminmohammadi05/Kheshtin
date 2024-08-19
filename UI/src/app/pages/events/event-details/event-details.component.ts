import { Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList, OnDestroy, AfterViewInit, HostListener, ChangeDetectorRef, Input, Inject, ElementRef, Renderer2 } from '@angular/core';
import { Event } from 'src/app/models/event';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Meta } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { AppSettings, Settings } from 'src/app/app.settings';
import {  } from 'ngx-scrollbar';
import { tap, map, mergeMap } from 'rxjs/operators';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { Product } from 'src/app/models/product';
import { Event as LocalEvent } from 'src/app/models/event';
import * as moment from 'jalali-moment'; // add this 1 of 4
import { EventImage } from 'src/app/models/event-image';
import * as uuid from 'uuid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventService } from 'src/app/services/event.service';
import { getImagesWithAbsolutePath, myDomain} from 'src/app/services/helpers/urlHelper';
import { NgxMasonryModule, NgxMasonryOptions } from 'ngx-masonry';
import { Lightbox } from 'ngx-lightbox';
import { log } from 'console';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDividerModule } from '@angular/material/divider';
import { EventDetailTimelineBoxComponent } from 'src/app/shared/event-detail-timeline-box/event-detail-timeline-box.component';
@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, FlexLayoutModule, MatChipsModule, MatListModule, MatSidenavModule, NgxMasonryModule, MatDividerModule, EventDetailTimelineBoxComponent]
})
export class EventDetailsComponent implements OnInit, OnDestroy, AfterViewInit  {
  viewType: string = 'grid';
  viewCol: number = 25;
  @ViewChild('sidenav', { static: true }) sidenav: ElementRef;
  @ViewChild('stickyCard', { static: true }) stickyCard: ElementRef;
  @ViewChild('delimiter', { static: true }) delimiter: ElementRef;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  private sub: any;
  public event: any;
  public settings: Settings;
  public embedVideo: any;
  public relatedEvents: any[];
  public featuredEvents: any[];
  public mortgageForm: FormGroup;
  public monthlyPayment: any;
  public contactForm: FormGroup;
  public productIdList: Observable<string[]>;
  public productList: Observable<Product[]>;
  public recentEvents: Observable<any[]>;

  public myOptions: NgxMasonryOptions = {
    gutter: 10,
    fitWidth: true
  };
  private _albums = [];
  eventId: string;
  eventImage: string;
  days = [];
  events = [];
  options = {format: 'days'};
  constructor(public appSettings: AppSettings,
              private activatedRoute: ActivatedRoute,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private renderer: Renderer2,
              private cdr: ChangeDetectorRef,
              public infoReq: MatDialog,
              public eventService: EventService,
              public basicService: BasicDataService,
              private _lightbox: Lightbox,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
    
      if (params.eventId) {
        this.eventId = params.eventId;
        this.getEvent(this.eventId);
      
        // this.getRelatedEvents();
        // this.getFeaturedEvents();
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
  public getEvent(id) {
    this.eventService.getEventById(id)
    .subscribe((e: any) => {
      if(!e.event[0]) {
        return;
      }
      this.event = e.event[0];
      
      e.event[0].bag.contentItems.map((et, ind) => {
        
        if(et.__typename === 'EventStep') {
          var eventPart = {
            width: 100,
            left: ind * 100,
            color: 'red',
            opacity: 1,
            contentItemId : ind,
            start: et.stepDate,
            end: et.stepEndDate, 
            title: et.userTitle
          };      
          this.events.push(eventPart);
        }
       
      })
     
      
    })


    
    
    // this.eventService.getEventById(id)
    // .subscribe(xx => {
    //   this.event = xx.event[0]
     
     
    //     var eventTemp = this.event.bag.contentItems.filter(x => x.__typename === 'EventStep'); 
        
    //     eventTemp.map((et, ind) => {
    //       this.events.push({
    //         width: 100,
    //         left: ind * 100,
    //         color: 'red',
    //         opacity: 1,
    //         start: et.stepDate,
    //         end: eventTemp[eventTemp.length -1].stepEndDate, 
    //         title: et.userTitle
    //       });
    //     })
       
     
    //   this.events.map(y => {
       
        
    //     if(!this.days.map(x => x.date).includes(y.start))
    //     {
    //       this.days.push({
    //         offsetLeft : 0,
    //         offsetWidth : 150,
    //         date: y.start,
    //         left: 0,
    //         width: 0,
    //         backgroundColor : '',
    //         opacity : 1
    //       })
    //     }
    //     // moment(new Date(eventTemp[0].stepDate)).locale('fa').format('YYYY/MM/DD')
    //     if(!this.days.map(x => x.date).includes(y.end))
    //     {
    //       this.days.push({
    //         offsetLeft : 0,
    //         offsetWidth : 150,
    //         date: y.end,
    //         left: 0,
    //         width: 0,
    //         backgroundColor : '',
    //         opacity : 1
    //       })
    //     }
       
    //   })
      
    //     this.days = this.days.sort(function(a: any, b:any) { return new Date(a.date).valueOf() - new Date(b.date).valueOf() })// _.orderBy(this.days, [(obj) => moment(new Date(obj)).format("X") ], ['asc'])
        
    //     xx.event[0].bag.contentItems.filter(x => x.__typename === "EventImage").map(img => {

    //       const src = "https://orchard.kheshtin.ir" +img.image.urls[0];
    //       const caption = img.displayText;
    //       const thumb = "https://orchard.kheshtin.ir" +img.image.urls[0];
    //       const album = {
    //          src: src,
    //          caption: caption,
    //          thumb: thumb
    //       };
    
    //       this._albums.push(album);
    //     })
       
        
    //  });
    setTimeout(() => {
      // this.config.observer = true;
      // this.config2.observer = true;
      // this.swipers.forEach(swiper => {
      //   if (swiper) {
      //     swiper.setIndex(0);
      //   }
      // });
    });

  }
  removeDuplicates(arr) {
    return arr.filter((item,
        index) => arr.indexOf(item) === index);
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
    //   slidesPerView: 4,
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
   
    this.cdr.detectChanges();


  }


  public onOpenedChange() {
    // this.swipers.forEach(swiper => {
    //   if (swiper) {
    //     swiper.update();
    //   }
    // });
  }
  public getCategoriesNames(event) {
    
    return event?.eventType.contentItems[0].displayText;

  }
  // public selectImage(index: number) {
  //   this.swipers.forEach(swiper => {
  //     if (swiper['elementRef'].nativeElement.id === 'main-carousel') {
  //       swiper.setIndex(index);
  //     }
  //   });
  // }
  
  public getImagesWithAbsPath(htmlText: string){
    return getImagesWithAbsolutePath(htmlText, myDomain);
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

  public getRelatedEvents() {
    // this.event.subscribe(event => {
    //   if (event) {
    //     this.store.pipe(select(getRelatedEventsByCategory(event.eventCategorySetList)),
    //     map(events => {
    //       if (events.length > 5) {
    //         this.relatedEvents = events;
    //       } else {
    //         if (this.authService.loggedIn()) {
    //           this.store.dispatch(
    //             new GetRelatedEventsByCategoryAuth(
    //               event.eventCategorySetList.map(x => x.eventCategoryId),
    //               this.authService.getDecodedToken().nameid));
    //         } else {
    //           this.store.dispatch(
    //             new GetRelatedEventsByCategory(
    //               event.eventCategorySetList.map(x => x.eventCategoryId)));
    //         }
    //       }
    //     })).subscribe();
        
    //   }
    // });

  }

  public getFeaturedEvents() {
    // this.productService.getFeaturedProducts().subscribe(products => {
    //   this.featuredProducts = products.slice(0, 3);
    // });
  }

  public changeDateToFa(date) {
    if (date) {
      const cdate = moment(date).locale('fa').format('YYYY/MM/DD');
      return of(cdate);
    }
  }
public getEventCategoryName(event: Event) {
  // if (event) {
  //   return this.store
  //     .pipe(select(getEventCategoryListById(event.eventCategorySetList.map(x => x.eventCategoryId))),
  //   map((cats) => {
  //     if (cats) {
  //       return cats.filter(y => y).map(y => y.name).join(', ');
  //     }
  //   }));
  // } else {
  //   return of('');
  // }
}


public getImages(EventImages: EventImage[]): Observable<EventImage[]> {
  if (EventImages) {
    return of(EventImages);
  } else {
    return of([]);
  }

}
public getEventImages(event){
  return event?.bag.contentItems.filter(x => x.__typename === "EventImage");
}
public getEventSteps(event){
  return event?.bag.contentItems.filter(x => x.__typename === "EventStep");
}

public getSelectedImage(index): EventImage {
  let image = null;
  this.event.subscribe(x => {

    image = x ? x.eventImageList[index] : null;
  });
  return image;
}
getHtml(value) {
  return getImagesWithAbsolutePath(value, myDomain);
}
tagClick(tag: any) {

   
  this.router.navigate(['/events/1', {hashtag: tag.searchField ? this.basicService.encode(JSON.stringify(tag)) : null, categories: 'null', search: 'null'}]);

}
open(index: number): void {
  this._lightbox.open(this._albums, index);
}
}

