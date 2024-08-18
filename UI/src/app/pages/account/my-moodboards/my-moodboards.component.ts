import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PerfectScrollbarConfigInterface } from 'ngx-scrollbar';
import { Observable, fromEvent, merge, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { ProductsDataSource } from 'src/app/services/products-data-source';
import { CategoryService } from 'src/app/services/category.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap, skip, switchMap, map } from 'rxjs/operators';
import { Pagination } from 'src/app/models/pagination';

import { Brand } from 'src/app/models/brand';
import { BrandService } from 'src/app/services/brand.service';
import { Category } from 'src/app/models/category';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { PageImages } from 'src/app/models/page-images';
import { InitializeService } from 'src/app/services/initialize.service';
import { Search } from 'src/app/models/search';
import { UserMoodBoard } from 'src/app/models/user-moodboard';
import { MoodBoardSearch } from 'src/app/models/mood-board-search';
import { MyMoodBoardDataSource } from 'src/app/services/my-mood-board-data-source';
import { MoodBoardService } from 'src/app/services/mood-board.service';
import { MyMoodBoardSearch } from 'src/app/models/my-mood-board-search';

@Component({
    selector: 'app-my-mood-boards',
    templateUrl: './my-moodboards.component.html',
    styleUrls: ['./my-moodboards.component.css']
  })
export class MyMoodBoardsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public allMoodBoards: UserMoodBoard[] = [];
  public moodBoards: UserMoodBoard[] = [];
  public totalMoodBoards: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public isLoading = false;
  public message: string;
  public watcher: Subscription;
  public searchFields: MoodBoardSearch = new MoodBoardSearch({
    categoriesBoxNested: [],
    categoriesBox: [],
    searchBox: ''
  });
  public settings: Settings;
  dataSource: MyMoodBoardDataSource;
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              public initializeService: InitializeService,
              private authService: AuthService,
              public mediaObserver: MediaObserver,
              private activatedRoute: ActivatedRoute,
              private productService: ProductsService,
              private brandService: BrandService,
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
    this.dataSource = new MyMoodBoardDataSource(this.moodBoardService, this.authService);
    // this.store.pipe(select(getAllMoodBoardSearches),
    // tap((searches) => {
    //   if (searches  && searches.length > 0) {
    //     this.searchFields = searches[0];
    //   }
    // })).subscribe();
    this.dataSource.loadMoodBoards();
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }


  public getMoodBoards() {
    this.dataSource.loadMoodBoards();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new MyMoodBoardSearch({
      searchId: 1,
      userId: this.authService.getDecodedToken().nameid,
      pageQuery: new Pagination(0, this.count, null, null)
    });
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
    this.getMoodBoards();
    window.scrollTo(0, 0);
  }


  public changeCount(count) {
    this.count = count;
    this.resetPagination();
    this.getMoodBoards();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.getMoodBoards();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.searchFields = new MyMoodBoardSearch({
      searchId: 1,
      userId: this.authService.getDecodedToken().nameid,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    // this.store.dispatch(new SaveMyMoodBoardSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }
}
