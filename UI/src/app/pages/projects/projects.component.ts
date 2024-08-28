import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Component, OnInit, ElementRef, ViewChild, AfterViewInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, fromEvent, merge, Subscription, combineLatest, BehaviorSubject } from 'rxjs';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, tap, switchMap, map } from 'rxjs/operators';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { AppSettings, Settings } from '../../app.settings';
import { PageImages } from '../../models/page-images';
import { Pagination } from '../../models/pagination';
import { Project } from '../../models/project';
import { ProjectCategory } from '../../models/project-category';
import { ProjectSearch } from '../../models/project-search';
import { AuthService } from '../../services/auth.service';
import { InitializeService } from '../../services/initialize.service';
import { ProjectDataSource } from '../../services/project-data-source';
import { ProjectService } from '../../services/project.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css']
})
export class ProjectsComponent implements OnInit, OnDestroy, AfterViewInit {
  selectedCategories: ProjectCategory[] = [];
  filteredCategories: string[] = ['-1'];
  categories: ProjectCategory[] = [];
  dataSource!: ProjectDataSource;
  @ViewChild('input')
  input!: ElementRef;
  // @ViewChild('categoryList') categoryList: MultiSelect;




@ViewChild('sidenav', { static: true }) sidenav: any;
public sidenavOpen = true;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  public categoriesBS!: BehaviorSubject<ProjectCategory[]>;

public allProjects: Project[] = [];
public projects: Project[] = [];
  public slides!: Observable<PageImages[]>;
public viewType = 'grid';
public viewCol = 33.3;
public count = 12;
  public sort!: string;
public searchFields: ProjectSearch = new ProjectSearch({
  searchId: 1,
  designersBox: [],
  categoriesBox: [],
  searchBox: ''
});
  public removedSearchField!: string;
public pagination: Pagination = new Pagination(0, this.count, 0, 0);
  public message!: string;
  public watcher!: Subscription;
  public totalProjects!: Observable<number>;
public isLoading = false;
public settings: Settings;
private route= inject( ActivatedRoute);
              private router= inject( Router);
              private projectService= inject( ProjectService);
              private authService= inject( AuthService);
              public appSettings= inject( AppSettings);
              public initializeService= inject( InitializeService);
              public mediaObserver= inject( MediaObserver);
              private cdRef= inject( ChangeDetectorRef);
  constructor() {
                this.settings = this.appSettings.createNew()
                
               }

  ngOnInit() {
    combineLatest([this.categoriesBS.asObservable(), this.route.params]).subscribe((x: any) => {      
      if (x[0].length > 0 &&
         (
          (x[1]["search"] && x[1]["search"].toString() !== 'null')||
          (x[1]["categories"] && x[1]["categories"].toString() !== 'null'))) {
        this.getProjects(x[0],+x[1]["page"],x[1]["search"], x[1]["categories"]);
      } else if(x[1]["search"] && x[1]["search"].toString() === 'null' &&
       x[1]["categories"] && x[1]["categories"].toString() === 'null') {
        this.router.navigate(['/projects', this.searchFields.pageQuery.currentPage + 1]);

      }
      else if (+x[1]["page"] && !x[1]["search"] && !x[1]["categories"] ){        
        this.projectService.getAllProjects(this.searchFields.pageQuery.itemsPerPage, this.searchFields.pageQuery.itemsPerPage * (+x[1]["page"] - 1)).subscribe((x:any) => {
          this.projects = x.project
        });
      }
    })
    // this.getSlides();
   
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
}
ngOnDestroy() {

}
public getSlides() {
  if (this.authService.loggedIn()) {
    this.slides = this.initializeService.getPageImagesAuth(this.authService.getDecodedToken().nameid, 1);
  } else {
    this.slides = this.initializeService.getPageImages(1);
  }
}


public getProjects(cats: any[], currentPage: number, search: string, categories: { replace: (arg0: string, arg1: string) => { (): any; new(): any; split: { (arg0: string): { (): any; new(): any; length: number; includes: { (arg0: any): any; new(): any; }; join: { (arg0: string): any; new(): any; }; }; new(): any; }; }; }) {
  // this.searchFields = new ProjectSearch({
  //   searchId: 1,
  // categoriesBoxNested: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter((x: { categoryId: { toString: () => any; }; }) => {
  //   if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
  //     return x;
  //   }
  // }) : [],
  // categoriesBox: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter((x: { categoryId: { toString: () => any; }; }) => {
  //   if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
  //     return x;
  //   }
  // }) : [],
  // pageQuery: new Pagination(currentPage - 1, this.count, 0, 0)
  // })
  // this.projectService.getProjects(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''} ${categories ? categories.replace('null', '').split('_').join(' ') : ''}'}`).subscribe((x:any) => {
  //   this.projects = x.searchProjects
  // });
  
}

public resetPagination() {
  if (this.paginator) {
    this.paginator.pageIndex = 0;
  }
  this.pagination = new Pagination(1, this.count, this.pagination.totalItems, this.pagination.totalPages);
}

public filterData(data: Project[]) {
  return this.projectService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
}

public searchClicked() {
  this.projects.length = 0;
  // this.getProjects();
  window.scrollTo(0, 0);
}
public searchChanged(event: { value: { categoriesBox: string | any[]; }; }) {
  this.resetPagination();
      this.searchFields = new ProjectSearch({
        searchId: 1,
        categoriesBox: event.value.categoriesBox &&
           event.value.categoriesBox.length > 0 ? event.value.categoriesBox : [],
        pageQuery: new Pagination(0, this.count, 0, 0),
        searchBox: ''
      });
      // this.store.dispatch(new ResetBlogsRequest());
      // this.store.dispatch(new SaveBlogSearchForRequest(this.searchFields));
      setTimeout(() => {
        this.removedSearchField = '';
      });
      if (!this.settings.searchOnBtnClick) {
        this.projects.length = 0;
      }
      if (!this.settings.searchOnBtnClick) {
        this.router.navigate(['/projects', this.searchFields.pageQuery.currentPage + 1, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categoriesBox.length > 0 ? this.searchFields.categoriesBox.map(x => x.id).join('_') : 'null'}]);

      }
}
public removeSearchField(field: string) {
  this.message = '';
  this.removedSearchField = field;
}


public changeCount(count: number) {
  this.count = count;
  this.projects.length = 0;
  this.resetPagination();
  // this.getProjects();
}
public changeSorting(sort: string) {
  this.sort = sort;
  this.projects.length = 0;
  // this.getProjects();
}
public changeViewType(obj: { viewType: string; viewCol: number; }) {
  this.viewType = obj.viewType;
  this.viewCol = obj.viewCol;
}


public onPageChange(e: { pageIndex: number; }) {
  this.pagination.currentPage = e.pageIndex ;
  // this.getProjects();
  window.scrollTo(0, 0);
}

}
