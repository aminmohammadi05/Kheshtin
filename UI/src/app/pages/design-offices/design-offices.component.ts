import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Observable, fromEvent, merge, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { ProductsService } from 'src/app/services/products.service';
import { ProductsDataSource } from 'src/app/services/products-data-source';
import { CategoryService } from 'src/app/services/category.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap, skip, switchMap, map } from 'rxjs/operators';
import { Pagination } from 'src/app/models/pagination';
import { DesignOffice } from 'src/app/models/design-office';
import { DesignOfficeService } from 'src/app/services/design-office.service';
import { Category } from 'src/app/models/category';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { Property } from 'src/app/app.models';
import { AuthService } from 'src/app/services/auth.service';
import { PageImages } from 'src/app/models/page-images';
import { InitializeService } from 'src/app/services/initialize.service';
import { DesignOfficeSearch } from 'src/app/models/design-office-search';
import { DesignOfficeDataSource } from 'src/app/services/design-office-data-source';
import { BasicDataService } from 'src/app/services/basic-data.service';

@Component({
  selector: 'app-design-offices',
  templateUrl: './design-offices.component.html',
  styleUrls: ['./design-offices.component.css']
})
export class DesignOfficesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public allDesignOffices: DesignOffice[] = [];
  public designOffices: DesignOffice[] = [];
  public slides: PageImages[] = [];
  public totalDesignOffices: Observable<number>;
  public viewType = 'grid';
  public viewCol = 25;
  public count = 12;
  public sort: string;
  public searchFields: DesignOfficeSearch = new DesignOfficeSearch({
    searchId: 1,
    categories: [],
    designers: [],
    pageQuery: new Pagination(0, this.count, null, null),
    searchBox: ''
  });
  
  public removedSearchField: string;
  public isLoading = false;
  public pagination: Pagination = new Pagination(0, this.count, null, null);
  public message: string;
  public watcher: Subscription;

  public settings: Settings;

  categoryId: number;
  searchTerm = 'filter=';
  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private authService: AuthService,
              public mediaObserver: MediaObserver,
              public initializeService: InitializeService,
              private route: ActivatedRoute,
              public basicService: BasicDataService,
              private router: Router,
              private productService: ProductsService,
              private designOfficeService: DesignOfficeService,
              private cdRef: ChangeDetectorRef) {
    this.settings = this.appSettings.settings;


}

  ngOnInit() {
    this.isLoading = true;
    combineLatest([this.route.params]).subscribe((x: any) => { 
      if (x[0] && ((x[0]["search"] && x[0]["search"].toString() !== 'null')||
      (x[0]["hashtag"] && x[0]["hashtag"].toString() !== 'null'))) {
        
        this.getDesignOffices(x[0],+x[0]["page"],x[0]["search"],x[0]["hashtag"]);
      } else if(x[0] && x[0]["search"] && x[0]["search"].toString() === 'null'&&
      x[0]["hashtag"] && x[0]["hashtag"].toString() === 'null' ) {
        
        this.router.navigate(['/designoffices', this.searchFields.pageQuery.currentPage + 1]);

      }
      else if (+x[0]["page"] && (!x[0] || (x[0] && !x[0]["search"] && !x[0]["hashtag"]))  ){   
       
        this.designOfficeService.getAllDesignOffices(this.searchFields.pageQuery.itemsPerPage, this.searchFields.pageQuery.itemsPerPage * (+x[0]["page"] - 1)).subscribe((y:any) => {
          this.searchFields.pageQuery.totalItems = y[0].items[0].DesignOfficeCount;
          this.message = y[0].items[0].DesignOfficeCount === 0 ? "موردی یافت نشد" : '';
          this.designOffices = y[1].designOffice;
          this.isLoading = false;
        });
      }
    })
    // this.getSlides();
   
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }
  public getSlides() {
    if (this.authService.loggedIn()) {
      this.initializeService.getPageImagesAuth(this.authService.getDecodedToken().nameid, 7).subscribe(x => {
        this.slides = x;
      });
    } else {
      this.initializeService.getPageImages(7).subscribe(x => {
        this.slides = x;
      });
    }
  }
  public getDesignOffices(cats, currentPage, search, hashtagObject) {
    this.searchFields = new DesignOfficeSearch({
      searchId: 1,  
      hashtagObject: JSON.parse(this.basicService.decode(hashtagObject)),  
    pageQuery: new Pagination(currentPage - 1, this.count, null, null)
    })
    this.designOfficeService.getDesignOffices(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''} ${hashtagObject !== 'null' ? JSON.parse(this.basicService.decode(hashtagObject)).searchField.replace('#', '') : ''}'}`).subscribe((x:any) => {
      this.searchFields.pageQuery.totalItems = x[0].count
      this.message = x[0].count === 0 ? "موردی یافت نشد" : '';
      this.designOffices = x[1].searchDesignOffices;
      this.isLoading = false;
    });
  }

  ngOnDestroy() {

  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
      this.searchFields = new DesignOfficeSearch({
        searchId: 1,
        pageQuery: new Pagination(0, this.count, null, null)
      });
    }
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
    this.designOffices.length = 0;
   
    window.scrollTo(0, 0);
  }
  public searchChanged(event) {
    this.resetPagination();
      this.searchFields = new DesignOfficeSearch({
        searchId: 1,
        hashtagObject: event.value.hashtagObject ? event.value.hashtagObject : '',
        pageQuery: new Pagination(0, this.count, null, null),
        searchBox: ''
      });
      // this.store.dispatch(new ResetBlogsRequest());
      // this.store.dispatch(new SaveBlogSearchForRequest(this.searchFields));
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        this.designOffices.length = 0;
      }
      if (!this.settings.searchOnBtnClick) {
        this.router.navigate(['/designoffices', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', hashtag: this.searchFields.hashtagObject ? this.basicService.encode(JSON.stringify(this.searchFields.hashtagObject)) : 'null'}]);

      }

  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }


  public changeCount(count) {
    this.count = count;
    this.designOffices.length = 0;
    this.resetPagination();
    // this.getDesignOffices();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.designOffices.length = 0;
    // this.getDesignOffices();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.pagination.currentPage = e.pageIndex;
    this.searchFields = new DesignOfficeSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    // this.store.dispatch(new SaveDesignOfficeSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }
}
