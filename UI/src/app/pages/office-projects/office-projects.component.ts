import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Observable, fromEvent, merge, Subscription, BehaviorSubject, combineLatest, forkJoin, zip } from 'rxjs';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { debounceTime, distinctUntilChanged, tap, switchMap, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { AppSettings, Settings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { Pagination } from 'src/app/models/pagination';
import { InitializeService } from 'src/app/services/initialize.service';
import { PageImages } from 'src/app/models/page-images';
import { OfficeProjectCategory } from 'src/app/models/office-project-category';
import { OfficeProjectDataSource } from 'src/app/services/office-project-data-source';
import { OfficeProject } from 'src/app/models/office-project';
import { OfficeProjectSearch } from 'src/app/models/office-project-search';
import { OfficeProjectService } from 'src/app/services/office-project.service';
import { ProjectCategory } from 'src/app/models/project-category';
import { DesignOffice } from 'src/app/models/design-office';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-office-projects',
  templateUrl: './office-projects.component.html',
  styleUrls: ['./office-projects.component.css']
})
export class OfficeProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedCategories: OfficeProjectCategory[] = [];
  filteredCategories: string[] = ['-1'];
  categories: OfficeProjectCategory[] = [];
 
  @ViewChild('input') input: ElementRef;
  public categoriesBS : BehaviorSubject<OfficeProjectCategory[]> = new BehaviorSubject([]);
  public designersBS : BehaviorSubject<DesignOffice[]> = new BehaviorSubject([]);



@ViewChild('sidenav', { static: true }) sidenav: any;
public sidenavOpen = true;
@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
public psConfig: PerfectScrollbarConfigInterface = {
  wheelPropagation: true
};
public allOfficeProjects: OfficeProject[] = [];
public officeProjects: OfficeProject[] = [];
public slides: PageImages[] = [];
public viewType = 'grid';
public viewCol = 33.3;
public count = 12;
public sort: string;
public searchFields: OfficeProjectSearch = new OfficeProjectSearch({
  searchId: 1,
  categories: [],
  designers: [],
  searchBox: '',
  pageQuery: new Pagination(0, this.count, null, null)
});
public categoriesParam = '';
public designersParam = '';
public searchParam = '';
public removedSearchField: string;

public message = 'هیچ';
public watcher: Subscription;
public totalOfficeProjects: Observable<number>;
public isLoading = false;
public settings: Settings;
public config: SwiperConfigInterface = {};
private pagination: SwiperPaginationInterface = {
  el: '.swiper-pagination',
  clickable: true
};
  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: OfficeProjectService,
              private authService: AuthService,
              public appSettings: AppSettings,
              public basicService: BasicDataService,
              public appService: AppService,
              public initializeService: InitializeService,
              public mediaObserver: MediaObserver,
              private cdRef: ChangeDetectorRef) {
                this.settings = this.appSettings.settings;
                
               }

  ngOnInit() {
    this.isLoading = true;
    
    combineLatest([this.categoriesBS.asObservable(), this.route.params, this.designersBS.asObservable()]).subscribe((x: any) => { 
      if(x[0].length > 0 && x[2].length > 0 && x[1]) {
        
          if ((
            (x[1]["search"] && x[1]["search"].toString() !== 'null')|| 
            (x[1]["categories"] && x[1]["categories"].toString() !== 'null') ||
            (x[1]["hashtag"] && x[1]["hashtag"].toString() !== 'null')||
            (x[1]["designers"] && x[1]["designers"].toString() !== 'null'))) {
            this.getOfficeProjects(x[0],x[2],+x[1]["page"],x[1]["search"], x[1]["categories"], x[1]["designers"], x[1]["hashtag"]);
        } else if(x[1]["search"] && x[1]["search"].toString() === 'null' &&       
      x[1]["categories"] && x[1]["categories"].toString() === 'null' &&
      x[1]["hashtag"] && x[1]["hashtag"].toString() === 'null' &&
      x[1]["designers"] && x[1]["designers"].toString() === 'null') {
       this.router.navigate(['/officeprojects', this.searchFields.pageQuery.currentPage + 1]);

     }
     else if (+x[1]["page"] && !x[1]["search"] && !x[1]["designers"]  && !x[1]["categories"]&& !x[1]["hashtag"] ){
       this.projectService.getAllOfficeProjects(this.searchFields.pageQuery.itemsPerPage, this.searchFields.pageQuery.itemsPerPage * (+x[1]["page"] - 1)).subscribe((x:any) => {
         this.searchFields.pageQuery.totalItems = x[0].items[0].ProjectCount;
         this.message = x[0].items[0].ProjectCount === 0 ? "موردی یافت نشد" : '';
         this.officeProjects = x[1].project;
         this.isLoading = false;
       });
     }
      }
   
      
    })
    // this.getSlides();
    
    
  }
  public initCarousel() {
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: false,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      nested: true,
      // autoplay: {
      //   delay: 5000,
      //   disableOnInteraction: false
      // },
      speed: 500,
      effect: 'slide'
    };
  }
  ngAfterViewInit() {
    this.initCarousel();
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


public getOfficeProjects(cats, designerList, currentPage, search, categories, designers, hashtagObject) {
  this.searchFields = new OfficeProjectSearch({
    searchId: 1,
  designers: designers && designers.replace('null', '').split('_').length > 0 ?  designerList.filter(x => {
    if(designers.replace('null', '').split('_').includes(x.id.toString())){
      return x;
    }
  }) : [],
  categories: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter(x => {
    if(categories.replace('null', '').split('_').includes(x.id.toString())){
      return x;
    }
  }) : [], 
  hashtagObject: JSON.parse(this.basicService.decode(hashtagObject)), 
  pageQuery: new Pagination(currentPage - 1, this.count, null, null)
  })
  this.projectService.getOfficeProjects(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''}  ${categories ? categories.replace('null', '').split('_').map(x => 'ProjectType-'+x).join(' ') : ''} ${designers ? designers.replace('null', '').split('_').join(' ') : ''} ${hashtagObject !== 'null' ? JSON.parse(this.basicService.decode(hashtagObject)).searchField.replace('#', '') : ''}'}`).subscribe((y:any) => {
    this.searchFields.pageQuery.totalItems = y[0].count
    this.message = y[0].count === 0 ? "موردی یافت نشد" : '';
    this.officeProjects = y[1].searchProjects;
    this.isLoading = false;
  });
}

public resetPagination() {
  if (this.paginator) {
    this.paginator.pageIndex = 0;
  }
  this.searchFields = new OfficeProjectSearch({
    searchId: 1,
    pageQuery: new Pagination(0, this.count, null, null)
  });
}


public searchClicked() {
  this.officeProjects.length = 0;
  
  window.scrollTo(0, 0);
}
public searchChanged(event) {
  
  if (event ) {
    this.isLoading = true;
    this.resetPagination();
    this.searchFields = new OfficeProjectSearch({
      searchId: 1,
      designers: event.value.designers &&
      event.value.designers.length > 0 ? event.value.designers : [],
      categories: event.value.categories &&
      event.value.categories.length > 0 ? event.value.categories : [],
      searchBox: event.value.searchBox &&
      event.value.searchBox.length > 0 ? event.value.searchBox : '',
      hashtagObject: event.value.hashtagObject ? event.value.hashtagObject : '',
      pageQuery: new Pagination(0, this.count, null, null)
    });
    setTimeout(() => {
        this.removedSearchField = null;
      });
    if (!this.settings.searchOnBtnClick) {
        this.officeProjects.length = 0;
      }
    if (!this.settings.searchOnBtnClick) {
      this.router.navigate(['/officeprojects', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categories.length > 0 ? this.searchFields.categories.map(x => x.id).join('_') : 'null',  designers: this.searchFields.designers.length > 0 ? this.searchFields.designers.map(x => x.id).join('_') : 'null', hashtag: this.searchFields.hashtagObject ? this.basicService.encode(JSON.stringify(this.searchFields.hashtagObject)) : 'null'}]);
        
      }
  }
 
}
public removeSearchField(field) {
  this.message = null;
  this.removedSearchField = field;
}


public changeCount(count) {
  this.count = count;
  this.officeProjects.length = 0;
  this.resetPagination();
  // this.getOfficeProjects();
}
public changeSorting(sort) {
  this.sort = sort;
  this.officeProjects.length = 0;
  // this.getOfficeProjects();
}
public changeViewType(obj) {
  this.viewType = obj.viewType;
  this.viewCol = obj.viewCol;
}


public onPageChange(e) {
  this.searchFields = new OfficeProjectSearch({
    searchId: 1,
    pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
  });
  // this.store.dispatch(new SaveOfficeProjectSearchForRequest(this.searchFields));
  window.scrollTo(0, 0);
}

}
