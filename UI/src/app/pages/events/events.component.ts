import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Observable, fromEvent, merge, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import {  } from 'ngx-scrollbar';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { FlexLayoutModule, MediaChange, MediaObserver } from '@angular/flex-layout';
import { AppSettings, Settings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { Pagination } from 'src/app/models/pagination';
import { InitializeService } from 'src/app/services/initialize.service';
import { PageImages } from 'src/app/models/page-images';
import { EventCategory } from 'src/app/models/event-category';
import { EventDataSource } from 'src/app/services/event-data-source';
import { Event } from 'src/app/models/event';
import { EventSearch } from 'src/app/models/event-search';
import { EventService } from 'src/app/services/event.service';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { log } from 'console';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderImageComponent } from 'src/app/shared/header-image/header-image.component';
import { HeaderCarouselComponent } from 'src/app/shared/header-carousel/header-carousel.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { EventItemComponent } from 'src/app/shared/event-item/event-item.component';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { MatCardModule } from '@angular/material/card';
import { EventsSearchResultsFiltersComponent } from 'src/app/shared/events-search-results-filters/events-search-results-filters.component';
import { EventsSearchComponent } from 'src/app/shared/events-search/events-search.component';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatButtonModule, FlexLayoutModule, HeaderImageComponent, MatChipsModule, MatListModule, MatSidenavModule, EventItemComponent, PaginationComponent, HeaderCarouselComponent, EventsSearchResultsFiltersComponent, EventsSearchComponent]
})
export class EventsComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedCategories: EventCategory[] = [];
  filteredCategories: string[] = ['-1'];
  categories: EventCategory[] = [];
  dataSource: EventDataSource;
  @ViewChild('input') input: ElementRef;




@ViewChild('sidenav', { static: true }) sidenav: any;
public sidenavOpen = true;
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
public psConfig = {
  wheelPropagation: true
};
public allEvents: Event[] = [];
public events: Event[] = [];
public slides: PageImages[] = [];
public viewType = 'list';
public viewCol = 33.3;
public count = 12;
public sort: string;
public categoriesBS : BehaviorSubject<EventCategory[]> = new BehaviorSubject([]);
public searchFields: EventSearch = new EventSearch({
  searchId: 1,
  categories: [],
  designers: [],
  searchBox: '',
  pageQuery: new Pagination(0, this.count, null, null)
});
public removedSearchField: string;

public message = 'هیچ';
public watcher: Subscription;
public totalEvents: Observable<number>;
public isLoading = false;
public settings: Settings;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private responsive: BreakpointObserver,
              private eventService: EventService,
              private authService: AuthService,
              public appSettings: AppSettings,
              public appService: AppService,
              public basicService: BasicDataService,
              public initializeService: InitializeService,
              public mediaObserver: MediaObserver,
              private cdRef: ChangeDetectorRef) {
                this.settings = this.appSettings.settings;

               }

  ngOnInit() {
    
    this.responsive.observe(Breakpoints.XSmall)
      .subscribe(result => {
        if (result.matches) {
          this.viewCol = 100;
        }

  });
  this.responsive.observe(Breakpoints.Small)
      .subscribe(result => {
        if (result.matches) {
          this.viewCol = 100;
        }

  });
  this.responsive.observe(Breakpoints.Medium)
      .subscribe(result => {
        if (result.matches) {
          this.viewCol = 33.3;
        }

  });
    this.isLoading = true;
    
    
    combineLatest([this.categoriesBS.asObservable(), this.route.params]).subscribe((x: any) => {  
      
          
      if (x[0].length > 0 &&
         (
          (x[1]["search"] && x[1]["search"].toString() !== 'null')||
          (x[1]["hashtag"] && x[1]["hashtag"].toString() !== 'null')||
          (x[1]["categories"] && x[1]["categories"].toString() !== 'null'))) {
           
        this.getEvents(x[0],+x[1]["page"],x[1]["search"], x[1]["categories"], x[1]["hashtag"]);
      } else if( x[1]["search"] && x[1]["search"].toString() === 'null' &&
       x[1]["hashtag"] && x[1]["hashtag"].toString() === 'null' &&
       x[1]["categories"] && x[1]["categories"].toString() === 'null') {
        
        
        this.router.navigate(['/events', this.searchFields.pageQuery.currentPage + 1]);

      }
      else if ( +x[1]["page"] && !x[1]["search"] && !x[1]["categories"]&& !x[1]["hashtag"] ){   
        
             
        this.eventService.getAllEvents(this.searchFields.pageQuery.itemsPerPage, this.searchFields.pageQuery.itemsPerPage * (+x[1]["page"] - 1)).subscribe((x:any) => {
          this.searchFields.pageQuery.totalItems = x[0].items[0].EventCount;
          this.message = x[0].items[0].EventCount === 0 ? "موردی یافت نشد" : '';
          this.events = x[1].event
          this.isLoading = false;
        });
      }
    })
    // this.getSlides();
    
    
  }

  ngAfterViewInit() {
}
ngOnDestroy() {


}
public getSlides() {
  if (this.authService.loggedIn()) {
    this.initializeService.getPageImagesAuth(this.authService.getDecodedToken().nameid, 3).subscribe(x => {
      this.slides = x;
    });
  } else {
    this.initializeService.getPageImages(3).subscribe(x => {
      this.slides = x;
    });
  }
}


public getEvents(cats, currentPage, search, categories, hashtagObject) {
  
  this.searchFields = new EventSearch({
    searchId: 1,
    hashtagObject: JSON.parse(this.basicService.decode(hashtagObject)),
    categories: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter(x => {
    if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
      return x;
    }
  }) : [],
  
  pageQuery: new Pagination(currentPage - 1, this.count, null, null)
  })
  this.eventService.getEvents(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''} ${categories ? categories.replace('null', '').split('_').join(' ') : ''} ${hashtagObject !== 'null' ? JSON.parse(this.basicService.decode(hashtagObject)).searchField.replace('#', '') : ''}'}`).subscribe((x:any) => {
    this.searchFields.pageQuery.totalItems = x[0].count
    this.message = x[0].count === 0 ? "موردی یافت نشد" : '';
    this.events = x[1].searchEvents
    this.isLoading = false;
  });
}

public resetPagination() {
  if (this.paginator) {
    this.paginator.pageIndex = 0;
  }
  this.searchFields = new EventSearch({
    searchId: 1,
    pageQuery: new Pagination(0, this.count, null, null)
  });
}


public searchClicked() {
  this.events.length = 0;
  // this.getEvents();
  window.scrollTo(0, 0);
}
public searchChanged(event) {
  this.resetPagination();
      this.searchFields = new EventSearch({
        searchId: 1,
        categories: event.value.categories &&
           event.value.categories.length > 0 ? event.value.categories : [],
        pageQuery: new Pagination(0, this.count, null, null),
        hashtagObject: event.value.hashtagObject ? event.value.hashtagObject : '',
        searchBox: event.value.searchBox && event.value.searchBox.replace(' ', '').length > 0 ? event.value.searchBox.replace(' ', '') : '',
      });
      // this.store.dispatch(new ResetBlogsRequest());
      // this.store.dispatch(new SaveBlogSearchForRequest(this.searchFields));
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        this.events.length = 0;
      }
      if (!this.settings.searchOnBtnClick) {
      
        this.router.navigate(['/events', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categories.length > 0 ? this.searchFields.categories.map(x => x.categoryId).join('_') : 'null', hashtag: this.searchFields.hashtagObject ? this.basicService.encode(JSON.stringify(this.searchFields.hashtagObject)) : 'null'}]);

      }
}
public removeSearchField(field) {
  this.message = null;
  this.removedSearchField = field;
}


public changeCount(count) {
  this.count = count;
  this.events.length = 0;
  this.resetPagination();
  // this.getEvents();
}
public changeSorting(sort) {
  this.sort = sort;
  this.events.length = 0;
  // this.getEvents();
}
public changeViewType(obj) {
  this.viewType = obj.viewType;
  this.viewCol = obj.viewCol;
}


public onPageChange(e) {
  this.searchFields = new EventSearch({
    searchId: 1,
    pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
  });
  // this.store.dispatch(new SaveEventSearchForRequest(this.searchFields));
  window.scrollTo(0, 0);
}

}
