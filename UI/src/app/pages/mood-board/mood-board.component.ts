import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef} from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute } from '@angular/router';
import { PerfectScrollbarConfigInterface } from 'ngx-scrollbar';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { AppSettings, Settings } from 'src/app/app.settings';
import { MoodBoardSearch } from 'src/app/models/mood-board-search';
import { PageImages } from 'src/app/models/page-images';
import { Pagination } from 'src/app/models/pagination';
import { UserMoodBoard } from 'src/app/models/user-moodboard';
import { AuthService } from 'src/app/services/auth.service';
import { InitializeService } from 'src/app/services/initialize.service';
import { MoodBoardDataSource } from 'src/app/services/mood-board-data-source';
import { MoodBoardService } from 'src/app/services/mood-board.service';


@Component({
  selector: 'app-mood-board',
  templateUrl: './mood-board.component.html',
  styleUrls: ['./mood-board.component.css']
})
export class MoodBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public allMoodBoards: UserMoodBoard[] = [];
  public moodBoards: UserMoodBoard[] = [];
  public slides: PageImages[] = [];
  public totalMoodBoards: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public searchFields: MoodBoardSearch = new MoodBoardSearch({
    categoriesBoxNested: [],
    categoriesBox: [],
    searchBox: 'filter=',
    pageQuery: new Pagination(0, 12, null, null)
  });
  public removedSearchField: string;
  public isLoading = false;
  public message = 'موردی یافت نشد';
  public watcher: Subscription;

  public settings: Settings;

  categoryId: number;
  dataSource: MoodBoardDataSource;
  searchTerm = 'filter=';
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private authService: AuthService,
              public mediaObserver: MediaObserver,
              public initializeService: InitializeService,
              private route: ActivatedRoute,
              private moodBoardService: MoodBoardService,
              private cdRef: ChangeDetectorRef) {
    this.settings = this.appSettings.settings;
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
      pageQuery: new Pagination(0, this.count, null, null)
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
  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      this.searchFields = new MoodBoardSearch({
        searchId: 1,
        categoriesBoxNested: event.value.categoriesBoxNested &&
           event.value.categoriesBoxNested.length > 0 ? event.value.categoriesBoxNested : [],
        searchBox: ''
      });
      setTimeout(() => {
        this.removedSearchField = null;
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
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }


  public changeCount(count) {
    this.count = count;
    this.moodBoards.length = 0;
    this.resetPagination();
    this.getMoodBoards();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.moodBoards.length = 0;
    this.getMoodBoards();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.searchFields = new MoodBoardSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    // this.store.dispatch(new SaveMoodBoardSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }
}
