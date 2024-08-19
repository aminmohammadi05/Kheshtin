import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import {  } from 'ngx-scrollbar';
import { Blog } from 'src/app/models/blog';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { Pagination } from 'src/app/models/pagination';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { AuthService } from 'src/app/services/auth.service';
import { MediaObserver, MediaChange, FlexLayoutModule } from '@angular/flex-layout';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators';
import { BlogService } from 'src/app/services/blog.service';
import { InitializeService } from 'src/app/services/initialize.service';
import { PageImages } from 'src/app/models/page-images';
import { BlogSearch } from 'src/app/models/blog-search';
import { BlogsDataSource } from 'src/app/services/blogs-data-source';
import { Search } from 'src/app/models/search';
import { BrandSearch } from 'src/app/models/brand-search';
import { Category } from 'src/app/models/category';
import { BasicDataService } from 'src/app/services/basic-data.service';
import {BreakpointObserver, Breakpoints} from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { BlogsSearchResultsFiltersComponent } from 'src/app/shared/blogs-search-results-filters/blogs-search-results-filters.component';
import { BlogsSearchComponent } from 'src/app/shared/blogs-search/blogs-search.component';
import { HeaderCarouselComponent } from 'src/app/shared/header-carousel/header-carousel.component';
import { HeaderImageComponent } from 'src/app/shared/header-image/header-image.component';
import { BlogItemComponent } from 'src/app/shared/blog-item/blog-item.component';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';


@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatSidenavModule, MatCardModule, MatChipsModule, MatListModule, MatFormFieldModule,  FlexLayoutModule, PaginationComponent, HeaderCarouselComponent, HeaderImageComponent, BlogsSearchComponent, BlogsSearchResultsFiltersComponent, BlogItemComponent],
})
export class BlogsComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  public categoriesBS : BehaviorSubject<Category[]> = new BehaviorSubject([]);
  public psConfig = {
    wheelPropagation: true
  };
  public allBlogs: Blog[] = [];
  public blogs: Blog[] = [];
  public slides: PageImages[] = [];
  public totalBlogs: Observable<number>;
  public viewType = 'list';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public searchFields: BlogSearch = new BlogSearch({
    searchId: 1,
    categoriesBoxNested: [],
    categoriesBox: [],
    searchBox: '',
    pageQuery: new Pagination(0, this.count, null, null)
  });
  public removedSearchField: string;
  public isLoading = false;
  public pagination: Pagination = new Pagination(0, this.count, null, null);
  public message: string;
  public watcher: Subscription;

  public settings: Settings;

  categoryId: number;
  searchTerm = '';
  constructor(public appSettings: AppSettings,
              private responsive: BreakpointObserver,
              public appService: AppService,
              public basicService: BasicDataService,
              private authService: AuthService,
              public mediaObserver: MediaObserver,
              public initializeService: InitializeService,
              private route: ActivatedRoute,
              private router: Router,
              private blogService: BlogService,
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
          (x[1]["hashtag"] && x[1]["hashtag"].toString() !== 'null')|| // will be removed in next stage
          (x[1]["categories"] && x[1]["categories"].toString() !== 'null'))) {
          
        this.getBlogs(x[0],+x[1]["page"],x[1]["search"], x[1]["categories"], x[1]["hashtag"]);
      } else if(x[1]["search"] && x[1]["search"].toString() === 'null' &&
       x[1]["hashtag"] && x[1]["hashtag"].toString() === 'null' &&
       x[1]["categories"] && x[1]["categories"].toString() === 'null') {
        this.router.navigate(['/blogs', this.searchFields.pageQuery.currentPage + 1]);

      }
      else if (+x[1]["page"] && !x[1]["search"] && !x[1]["categories"] && !x[1]["hashtag"] ){        
        this.blogService.getAllBlogs(this.searchFields.pageQuery.itemsPerPage, this.searchFields.pageQuery.itemsPerPage * (+x[1]["page"] - 1)).subscribe((x:any) => {
          this.searchFields.pageQuery.totalItems = x[0].items[0].BlogCount;
         this.message = x[0].items[0].BlogCount === 0 ? "موردی یافت نشد" : '';
          this.blogs = x[1].blog
          this.isLoading = false;
        });
      }
    })
    // this.getSlides();
    
  }
  ngAfterViewInit() {
  }
  public getSlides() {
    if (this.authService.loggedIn()) {
      this.initializeService.getPageImagesAuth(this.authService.getDecodedToken().nameid, 5).subscribe(x => {
        this.slides = x;
      });
    } else {
      this.initializeService.getPageImages(5).subscribe(x => {
        this.slides = x;
      });
    }
    
  }
  public getBlogs(cats, currentPage, search, categories, hashtagObject) {
   
    this.searchFields = new BlogSearch({
      searchId: 1,
    categoriesBoxNested: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter(x => {
      if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
        return x;
      }
    }) : [],
    categoriesBox: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter(x => {
      if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
        return x;
      }
    }) : [],
    searchBox: search,
    hashtagObject: JSON.parse(this.basicService.decode(hashtagObject)),
    pageQuery: new Pagination(currentPage - 1, this.count, null, null)
    })
   
    this.blogService.getBlogs(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''} ${categories ? categories.replace('null', '').split('_').join(' ') : ''} ${hashtagObject !== 'null' ? JSON.parse(this.basicService.decode(hashtagObject)).searchField.replace('#', '') : ''}'}`).subscribe((x:any) => {
      this.searchFields.pageQuery.totalItems = x[0].count
      this.message = x[0].count === 0 ? "موردی یافت نشد" : '';
      this.blogs = x[1].searchBlogs
      this.isLoading = false;
    });
  }

  // ngOnDestroy() {
  //   this.watcher.unsubscribe();
  // }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new BlogSearch({
      searchId: 1,
      pageQuery: new Pagination(0, this.count, null, null)
    });
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
   
    window.scrollTo(0, 0);
  }
  public searchChanged(event) {
    this.resetPagination();
      this.searchFields = new BlogSearch({
        searchId: 1,
        categoriesBoxNested: event.value.categoriesBoxNested &&
           event.value.categoriesBoxNested.length > 0 ? event.value.categoriesBoxNested : [],
        pageQuery: new Pagination(0, this.count, null, null),
        searchBox: event.value.searchBox && event.value.searchBox.replace(' ', '').length > 0 ? event.value.searchBox.replace(' ', '') : '',
        hashtagObject: event.value.hashtagObject ? event.value.hashtagObject : ''
      });
      // this.store.dispatch(new ResetBlogsRequest());
      // this.store.dispatch(new SaveBlogSearchForRequest(this.searchFields));
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        this.blogs.length = 0;
      }
      if (!this.settings.searchOnBtnClick) {
        this.router.navigate(['/blogs', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categoriesBoxNested.length > 0 ? this.searchFields.categoriesBoxNested.map(x => x.categoryId).join('_') : 'null', hashtag: this.searchFields.hashtagObject ? this.basicService.encode(JSON.stringify(this.searchFields.hashtagObject)) : 'null'}]);

      }
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }


  public changeCount(count) {
    this.count = count;
    this.blogs.length = 0;
    this.resetPagination();
    // this.getBlogs();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.blogs.length = 0;
    // this.getBlogs();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.pagination.currentPage = e.pageIndex;
    this.searchFields = new BlogSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    // this.store.dispatch(new SaveBlogSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }
}
