import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';

import {  } from 'ngx-scrollbar';
import { Observable, fromEvent, merge, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap, skip, switchMap, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AppSettings, Settings } from '../../../app.settings';
import { MoodBoardSearch } from '../../../models/mood-board-search';
import { MyMoodBoardSearch } from '../../../models/my-mood-board-search';
import { Pagination } from '../../../models/pagination';
import { UserMoodBoard } from '../../../models/user-moodboard';
import { AuthService } from '../../../services/auth.service';
import { BrandService } from '../../../services/brand.service';
import { InitializeService } from '../../../services/initialize.service';
import { MoodBoardService } from '../../../services/mood-board.service';
import { MyMoodBoardDataSource } from '../../../services/my-mood-board-data-source';
import { ProductsService } from '../../../services/products.service';
import { MoodBoardItemComponent } from '../../../shared/mood-board-item/mood-board-item.component';

@Component({
    selector: 'app-my-mood-boards',
    templateUrl: './my-moodboards.component.html',
    styleUrls: ['./my-moodboards.component.css'],
    standalone: true,
    imports: [CommonModule, MatIconModule, MatSidenavModule, MatChipsModule, MatListModule, MatFormFieldModule,MatProgressSpinnerModule, MatPaginatorModule, MoodBoardItemComponent],
  })
export class MyMoodBoardsComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  public psConfig = {
    wheelPropagation: true
  };
  public allMoodBoards: UserMoodBoard[] = [];
  public moodBoards: UserMoodBoard[] = [];
  public totalMoodBoards!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public isLoading = false;
  public message!: string;
  public watcher!: Subscription;
  public searchFields: MoodBoardSearch = new MoodBoardSearch({
    categoriesBoxNested: [],
    categoriesBox: [],
    searchBox: ''
  });
  public settings: Settings;
  dataSource!: MyMoodBoardDataSource;
  public appSettings= inject( AppSettings);
              public initializeService= inject( InitializeService);
              private authService= inject( AuthService);
              private activatedRoute= inject( ActivatedRoute);
              private productService= inject( ProductsService);
              private brandService= inject( BrandService);
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
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
    this.getMoodBoards();
    window.scrollTo(0, 0);
  }


  public changeCount(count: number) {
    this.count = count;
    this.resetPagination();
    this.getMoodBoards();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    this.getMoodBoards();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.searchFields = new MyMoodBoardSearch({
      searchId: 1,
      userId: this.authService.getDecodedToken().nameid,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    // this.store.dispatch(new SaveMyMoodBoardSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }
}
