import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

import { FormControl } from '@angular/forms';
import { Observable, fromEvent, merge, Subscription, BehaviorSubject, combineLatest, forkJoin, zip } from 'rxjs';
import {} from 'ngx-scrollbar';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, switchMap, map } from 'rxjs/operators';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
// import { SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { AppSettings, Settings } from '../../app.settings';
import { DesignOffice } from '../../models/design-office';
import { OfficeProject } from '../../models/office-project';
import { OfficeProjectCategory } from '../../models/office-project-category';
import { OfficeProjectSearch } from '../../models/office-project-search';
import { PageImages } from '../../models/page-images';
import { Pagination } from '../../models/pagination';
import { AuthService } from '../../services/auth.service';
import { BasicDataService } from '../../services/basic-data.service';
import { InitializeService } from '../../services/initialize.service';
import { OfficeProjectService } from '../../services/office-project.service';
import { HeaderCarouselComponent } from '../../shared/header-carousel/header-carousel.component';
import { HeaderImageComponent } from '../../shared/header-image/header-image.component';
import { OfficeProjectItemComponent } from '../../shared/office-project-item/office-project-item.component';
import { OfficeProjectsSearchResultsFiltersComponent } from '../../shared/office-projects-search-results-filters/office-projects-search-results-filters.component';
import { OfficeProjectsSearchComponent } from '../../shared/office-projects-search/office-projects-search.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-office-projects',
  templateUrl: './office-projects.component.html',
  styleUrls: ['./office-projects.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatProgressSpinnerModule, MatChipsModule, MatButtonModule, MatCardModule, MatSidenavModule,HeaderImageComponent, HeaderCarouselComponent, OfficeProjectItemComponent, OfficeProjectsSearchResultsFiltersComponent, OfficeProjectsSearchComponent, PaginationComponent]
})
export class OfficeProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedCategories: OfficeProjectCategory[] = [];
  filteredCategories: string[] = ['-1'];
  categories: OfficeProjectCategory[] = [];
 
  @ViewChild('input')
  input!: ElementRef;
  public categoriesBS!: BehaviorSubject<OfficeProjectCategory[]>;
  public designersBS!: BehaviorSubject<DesignOffice[]>;



@ViewChild('sidenav', { static: true }) sidenav: any;
public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
public psConfig = {
  wheelPropagation: true
};
public allOfficeProjects: OfficeProject[] = [];
public officeProjects: OfficeProject[] = [];
public slides: PageImages[] = [];
public viewType = 'grid';
public viewCol = 33.3;
public count = 12;
  public sort!: string;
public searchFields: OfficeProjectSearch = new OfficeProjectSearch({
  searchId: 1,
  categories: [],
  designers: [],
  searchBox: '',
  pageQuery: new Pagination(0, this.count, 0, 0)
});
public categoriesParam = '';
public designersParam = '';
public searchParam = '';
  public removedSearchField!: string;

public message = 'هیچ';
  public watcher!: Subscription;
  public totalOfficeProjects!: Observable<number>;
public isLoading = false;
public settings: Settings;
// public config: SwiperConfigInterface = {};
// private pagination: SwiperPaginationInterface = {
//   el: '.swiper-pagination',
//   clickable: true
// };
  constructor(private route: ActivatedRoute,
              private router: Router,
              private projectService: OfficeProjectService,
              private authService: AuthService,
              public appSettings: AppSettings,
              public basicService: BasicDataService,
              public initializeService: InitializeService,
              public mediaObserver: MediaObserver,
              private cdRef: ChangeDetectorRef) {
                this.settings = this.appSettings.createNew();
                
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
    // this.config = {
    //   slidesPerView: 1,
    //   spaceBetween: 0,
    //   keyboard: false,
    //   navigation: true,
    //   pagination: this.pagination,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   nested: true,
    //   // autoplay: {
    //   //   delay: 5000,
    //   //   disableOnInteraction: false
    //   // },
    //   speed: 500,
    //   effect: 'slide'
    // };
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


public getOfficeProjects(cats: any[], designerList: any[], currentPage: number, search: string, categories: { replace: (arg0: string, arg1: string) => { (): any; new(): any; split: { (arg0: string): { (): any; new(): any; length: number; includes: { (arg0: any): any; new(): any; }; map: { (arg0: (x: any) => string): any[]; new(): any; }; }; new(): any; }; }; }, designers: { replace: (arg0: string, arg1: string) => { (): any; new(): any; split: { (arg0: string): { (): any; new(): any; length: number; includes: { (arg0: any): any; new(): any; }; join: { (arg0: string): any; new(): any; }; }; new(): any; }; }; }, hashtagObject: string) {
  this.searchFields = new OfficeProjectSearch({
    searchId: 1,
  designers: designers && designers.replace('null', '').split('_').length > 0 ?  designerList.filter((x: { id: { toString: () => any; }; }) => {
    if(designers.replace('null', '').split('_').includes(x.id.toString())){
      return x;
    }
  }) : [],
  categories: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter((x: { id: { toString: () => any; }; }) => {
    if(categories.replace('null', '').split('_').includes(x.id.toString())){
      return x;
    }
  }) : [], 
  hashtagObject: JSON.parse(this.basicService.decode(hashtagObject)), 
  pageQuery: new Pagination(currentPage - 1, this.count, 0, 0)
  })
  this.projectService.getOfficeProjects(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''}  ${categories ? categories.replace('null', '').split('_').map((x: string) => 'ProjectType-'+x).join(' ') : ''} ${designers ? designers.replace('null', '').split('_').join(' ') : ''} ${hashtagObject !== 'null' ? JSON.parse(this.basicService.decode(hashtagObject)).searchField.replace('#', '') : ''}'}`).subscribe((y:any) => {
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
    pageQuery: new Pagination(0, this.count, 0, 0)
  });
}


public searchClicked() {
  this.officeProjects.length = 0;
  
  window.scrollTo(0, 0);
}
public searchChanged(event: { value: { designers: string | any[]; categories: string | any[]; searchBox: string | any[]; hashtagObject: any; }; }) {
  
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
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
    setTimeout(() => {
        this.removedSearchField = '';
      });
    if (!this.settings.searchOnBtnClick) {
        this.officeProjects.length = 0;
      }
    if (!this.settings.searchOnBtnClick) {
      this.router.navigate(['/officeprojects', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categories.length > 0 ? this.searchFields.categories.map(x => x.id).join('_') : 'null',  designers: this.searchFields.designers.length > 0 ? this.searchFields.designers.map(x => x.id).join('_') : 'null', hashtag: this.searchFields.hashtagObject ? this.basicService.encode(JSON.stringify(this.searchFields.hashtagObject)) : 'null'}]);
        
      }
  }
 
}
public removeSearchField(field: string) {
  this.message = '';
  this.removedSearchField = field;
}


public changeCount(count: number) {
  this.count = count;
  this.officeProjects.length = 0;
  this.resetPagination();
  // this.getOfficeProjects();
}
public changeSorting(sort: string) {
  this.sort = sort;
  this.officeProjects.length = 0;
  // this.getOfficeProjects();
}
public changeViewType(obj: { viewType: string; viewCol: number; }) {
  this.viewType = obj.viewType;
  this.viewCol = obj.viewCol;
}


public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
  this.searchFields = new OfficeProjectSearch({
    searchId: 1,
    pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
  });
  // this.store.dispatch(new SaveOfficeProjectSearchForRequest(this.searchFields));
  window.scrollTo(0, 0);
}

}
