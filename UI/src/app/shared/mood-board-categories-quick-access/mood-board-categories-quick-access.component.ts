import { Component, OnInit, AfterViewInit, Renderer2, Output, EventEmitter } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AppService } from 'src/app/app.service';
import { Observable, Subject } from 'rxjs';
import { Category } from 'src/app/models/category';
import { map } from 'rxjs/operators';
import { Search } from 'src/app/models/search';
import { Router } from '@angular/router';
import { CategoriesQuickAccessService } from './mood-board-categories-quick-access.service';

@Component({
  selector: 'app-mood-board-categories-quick-access',
  templateUrl: './mood-board-categories-quick-access.component.html',
  styleUrls: ['./mood-board-categories-quick-access.component.scss']
})
export class MoodBoardCategoriesQuickAccessComponent implements OnInit, AfterViewInit {
  @Output() CategoryChange: EventEmitter<any> = new EventEmitter<any>();
  public clients;
  public config: SwiperConfigInterface = { };
  public categoryList$: Observable<Category[]>;
  constructor(public appService: AppService,
              public categoryQuickAccessService: CategoriesQuickAccessService,
              public router: Router) { }

  ngOnInit() {
    this.clients = this.appService.getClients();
    // this.categoryList$ = this.store.pipe(select(getAllCategoriesForQuickAccess));
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 12,
      spaceBetween: 16,
      keyboard: true,
      navigation: false,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
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

  openSubCategories(category: Category) {
    this.CategoryChange.emit(category);
  }

  categoryEnter(cat: Category) {
    this.categoryQuickAccessService.categorySubject.next(cat);
  }

 
}
