import { Component, OnInit, Input, OnDestroy, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { FlexLayoutModule, MediaChange, MediaObserver } from '@angular/flex-layout';
import {  } from 'ngx-scrollbar';
import { Observable, fromEvent, merge, Subscription, BehaviorSubject, combineLatest } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { debounceTime, distinctUntilChanged, tap, skip, switchMap, map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Settings } from 'http2';
import { AppSettings } from '../../app.settings';
import { DesignOffice } from '../../models/design-office';
import { DesignOfficeSearch } from '../../models/design-office-search';
import { PageImages } from '../../models/page-images';
import { Pagination } from '../../models/pagination';
import { AuthService } from '../../services/auth.service';
import { BasicDataService } from '../../services/basic-data.service';
import { DesignOfficeService } from '../../services/design-office.service';
import { InitializeService } from '../../services/initialize.service';
import { ProductsService } from '../../services/products.service';
import { DesignOfficeItemComponent } from '../../shared/design-office-item/design-office-item.component';
import { DesignOfficesSearchResultsFiltersComponent } from '../../shared/design-offices-search-results-filters/design-offices-search-results-filters.component';
import { DesignOfficesSearchComponent } from '../../shared/design-offices-search/design-offices-search.component';
import { HeaderCarouselComponent } from '../../shared/header-carousel/header-carousel.component';
import { HeaderImageComponent } from '../../shared/header-image/header-image.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-design-offices',
  templateUrl: './design-offices.component.html',
  styleUrls: ['./design-offices.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatChipsModule, MatButtonModule, MatSidenavModule, FlexLayoutModule, ReactiveFormsModule, MatProgressSpinnerModule, MatFormFieldModule, HeaderCarouselComponent, HeaderImageComponent, DesignOfficesSearchComponent, DesignOfficesSearchResultsFiltersComponent, DesignOfficeItemComponent, PaginationComponent],
})
export class DesignOfficesComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  public psConfig = {
    wheelPropagation: true
  };
  public allDesignOffices: DesignOffice[] = [];
  public designOffices: DesignOffice[] = [];
  public slides: PageImages[] = [];
  public totalDesignOffices!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 25;
  public count = 12;
  public sort!: string;
  public searchFields: DesignOfficeSearch = new DesignOfficeSearch({
    searchId: 1,
    categories: [],
    designers: [],
    pageQuery: new Pagination(0, this.count, 0, 0),
    searchBox: ''
  });
  
  public removedSearchField!: string;
  public isLoading = false;
  public pagination: Pagination = new Pagination(0, this.count, 0, 0);
  public message!: string;
  public watcher!: Subscription;







  public appSettings = inject(AppSettings);
              public basicService= inject(BasicDataService);
              public designOfficeService= inject(DesignOfficeService);
              private authService= inject(AuthService);
              public mediaObserver= inject(MediaObserver);
              public initializeService= inject(InitializeService);
              private route= inject(ActivatedRoute);
              private router= inject(Router);
              private cdRef= inject(ChangeDetectorRef);
  public settings= this.appSettings.createNew();

  categoryId!: number;
  searchTerm = 'filter=';
  constructor() {
  


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
  public getDesignOffices(cats: any, currentPage: number, search: string, hashtagObject: string) {
    this.searchFields = new DesignOfficeSearch({
      searchId: 1,  
      hashtagObject: JSON.parse(this.basicService.decode(hashtagObject)),  
    pageQuery: new Pagination(currentPage - 1, this.count, 0, 0)
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
        pageQuery: new Pagination(0, this.count, 0, 0)
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
  public searchChanged(event: { value: { hashtagObject: any; }; }) {
    this.resetPagination();
      this.searchFields = new DesignOfficeSearch({
        searchId: 1,
        hashtagObject: event.value.hashtagObject ? event.value.hashtagObject : '',
        pageQuery: new Pagination(0, this.count, 0, 0),
        searchBox: ''
      });
      // this.store.dispatch(new ResetBlogsRequest());
      // this.store.dispatch(new SaveBlogSearchForRequest(this.searchFields));
      setTimeout(() => {
        this.removedSearchField = '';
      });
      if (!this.settings.searchOnBtnClick) {
        this.designOffices.length = 0;
      }
      if (!this.settings.searchOnBtnClick) {
        this.router.navigate(['/designoffices', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', hashtag: this.searchFields.hashtagObject ? this.basicService.encode(JSON.stringify(this.searchFields.hashtagObject)) : 'null'}]);

      }

  }
  public removeSearchField(field: string) {
    this.message = '';
    this.removedSearchField = field;
  }


  public changeCount(count: number) {
    this.count = count;
    this.designOffices.length = 0;
    this.resetPagination();
    // this.getDesignOffices();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    this.designOffices.length = 0;
    // this.getDesignOffices();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.pagination.currentPage = e.pageIndex;
    this.searchFields = new DesignOfficeSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    // this.store.dispatch(new SaveDesignOfficeSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }
}
