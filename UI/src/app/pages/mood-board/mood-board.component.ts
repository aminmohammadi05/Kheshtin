import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef, inject} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {  } from 'ngx-scrollbar';
import { MonoTypeOperatorFunction, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AppSettings, Settings } from '../../app.settings';
import { MoodBoardSearch } from '../../models/mood-board-search';
import { PageImages } from '../../models/page-images';
import { Pagination } from '../../models/pagination';
import { UserMoodBoard } from '../../models/user-moodboard';
import { AuthService } from '../../services/auth.service';
import { InitializeService } from '../../services/initialize.service';
import { MoodBoardDataSource } from '../../services/mood-board-data-source';
import { MoodBoardService } from '../../services/mood-board.service';
import { BrandsCarouselComponent } from '../../shared/brands-carousel/brands-carousel.component';
import { HeaderCarouselComponent } from '../../shared/header-carousel/header-carousel.component';
import { HeaderImageComponent } from '../../shared/header-image/header-image.component';
import { MoodBoardItemComponent } from '../../shared/mood-board-item/mood-board-item.component';
import { MoodBoardsSearchResultsFiltersComponent } from '../../shared/mood-boards-search-results-filters/mood-boards-search-results-filters.component';
import { MoodBoardsSearchComponent } from '../../shared/mood-boards-search/mood-boards-search.component';


@Component({
  selector: 'app-mood-board',
  templateUrl: './mood-board.component.html',
  styleUrls: ['./mood-board.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatCardModule, MatButtonModule, MatChipsModule, MatListModule, MatFormFieldModule, MatSidenavModule, MatProgressSpinnerModule, MatPaginatorModule, RouterModule, HeaderCarouselComponent, HeaderImageComponent, MoodBoardsSearchComponent, MoodBoardsSearchResultsFiltersComponent, MoodBoardItemComponent, BrandsCarouselComponent ]
})
export class MoodBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  public psConfig = {
    wheelPropagation: true
  };
  public allMoodBoards: UserMoodBoard[] = [];
  public moodBoards: UserMoodBoard[] = [];
  public slides: PageImages[] = [];
  public totalMoodBoards!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public searchFields: MoodBoardSearch = new MoodBoardSearch({
    categoriesBoxNested: [],
    categoriesBox: [],
    searchBox: 'filter=',
    pageQuery: new Pagination(0, 12, 0, 0)
  });
  public removedSearchField!: string;
  public isLoading = false;
  public message = 'موردی یافت نشد';
  public watcher!: Subscription;

  public settings: Settings;

  categoryId!: number;
  dataSource!: MoodBoardDataSource;
  searchTerm = 'filter=';
  public appSettings= inject( AppSettings);
              private authService= inject( AuthService);
              public initializeService= inject( InitializeService);
              private route= inject( ActivatedRoute);
              private moodBoardService= inject( MoodBoardService);
              private cdRef= inject( ChangeDetectorRef);
  constructor() {
    this.settings = this.appSettings.createNew()
//     this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
//     if (change.mqAlias === 'xs') {
//       this.sidenavOpen = false;
//       this.viewCol = 100;
//     } else if (change.mqAlias === 'sm') {
//       this.sidenavOpen = false;
//       this.viewCol = 50;
//     } else if (change.mqAlias === 'md') {
//       this.viewCol = 50;
//       this.sidenavOpen = true;
//     } else {
//       this.viewCol = 33.3;
//       this.sidenavOpen = true;
//     }
// });

}

  ngOnInit() {
    // this.store.dispatch(new SaveMoodBoardSearchForRequest(this.searchFields));
    this.dataSource = new MoodBoardDataSource(this.moodBoardService, this.authService);
    // this.store.pipe(select(getAllMoodBoardSearches),
    // tap((searches) => {
    //   if (searches  && searches.length > 0) {
    //     this.searchFields = searches[0];
    //   }
    // })).subscribe();
    this.dataSource.loadMoodBoards();
    // this.getSlides();
  }
  ngAfterViewInit() {
  }
  public getSlides() {
    if (this.authService.loggedIn()) {
      this.initializeService.getPageImagesAuth(this.authService.getDecodedToken().nameid, 8).subscribe(x => {
        this.slides = x;
      });
    } else {
      this.initializeService.getPageImages(8).subscribe(x => {
        this.slides = x;
      });
    }
  }
  public getMoodBoards() {
    this.dataSource.loadMoodBoards();
  }

  ngOnDestroy() {

  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new MoodBoardSearch({
      searchId: 1,
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
    this.moodBoards.length = 0;
    this.getMoodBoards();
    window.scrollTo(0, 0);
  }
  public searchChanged(event: { valueChanges: { subscribe: (arg0: () => void) => void; pipe: (arg0: MonoTypeOperatorFunction<unknown>, arg1: MonoTypeOperatorFunction<unknown>) => { (): any; new(): any; subscribe: { (arg0: () => void): void; new(): any; }; }; }; value: { categoriesBoxNested: string | any[]; }; }) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      this.searchFields = new MoodBoardSearch({
        searchId: 1,
        categoriesBoxNested: event.value.categoriesBoxNested &&
           event.value.categoriesBoxNested.length > 0 ? event.value.categoriesBoxNested : [],
        searchBox: ''
      });
      setTimeout(() => {
        this.removedSearchField = '';
      });
      if (!this.settings.searchOnBtnClick) {
        this.moodBoards.length = 0;
      }
    });
    // this.store.dispatch(new ResetMoodBoardsRequest());
    // this.store.dispatch(new SaveMoodBoardSearchForRequest(this.searchFields));
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        this.getMoodBoards();
      }
    });
  }
  public removeSearchField(field: string) {
    this.message = '';
    this.removedSearchField = field;
  }


  public changeCount(count: number) {
    this.count = count;
    this.moodBoards.length = 0;
    this.resetPagination();
    this.getMoodBoards();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    this.moodBoards.length = 0;
    this.getMoodBoards();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.searchFields = new MoodBoardSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    // this.store.dispatch(new SaveMoodBoardSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }
}
