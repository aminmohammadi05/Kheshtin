import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input, 
  inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DesignOfficeDetailComponent } from '../design-office-detail/design-office-detail.component';
import { CategoriesComponent } from '../../categories/categories.component';
import { MatPaginator } from '@angular/material/paginator';
import { AppSettings, Settings } from '../../../app.settings';
import { DesignOfficeProjectSearch } from '../../../models/design-office-project-search';
import { Pagination } from '../../../models/pagination';
import { ProjectCategory } from '../../../models/project-category';
import { AuthService } from '../../../services/auth.service';
import { DesignOfficeVideoService } from '../../../services/design-office-video.service';
import { OneOfficeVideoDataSource } from '../../../services/one-office-video-data-source';
import { ProjectService } from '../../../services/project.service';
import { DesignOfficeDetailSearchComponent } from '../../../shared/design-office-detail-search/design-office-detail-search.component';
import { DesignOfficeItemComponent } from '../../../shared/design-office-item/design-office-item.component';
import { DesignOfficesSearchResultsFiltersComponent } from '../../../shared/design-offices-search-results-filters/design-offices-search-results-filters.component';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-design-office-projects',
  templateUrl: './design-office-projects.component.html',
  styleUrls: ['./design-office-projects.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatChipsModule, MatButtonModule, MatSidenavModule, FlexLayoutModule, ReactiveFormsModule, MatProgressSpinnerModule, MatFormFieldModule, DesignOfficeDetailSearchComponent, DesignOfficesSearchResultsFiltersComponent, DesignOfficeItemComponent, PaginationComponent, CategoriesComponent],
})
export class DesignOfficeProjectsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() designOffice: any;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public categoriesBS!: BehaviorSubject<ProjectCategory[]>;
  public psConfig = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  public projects: any[] = [];
  public totalVideos!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public isLoading = false;
  public searchFields: DesignOfficeProjectSearch = new DesignOfficeProjectSearch({
    searchId: 1,
    designerId: null,
    categories: [],
    pageQuery: new Pagination(0, 12, 0, 0),
    searchBox: ''
  });
  public message!: string;
  public watcher!: Subscription;
  public removedSearchField!: string;
  public settings: Settings;
  public dataSource!: OneOfficeVideoDataSource;
  public appSettings = inject(AppSettings);
              public projectService= inject(ProjectService);
              public officeVideoService= inject(DesignOfficeVideoService);
              private authService= inject(AuthService);
              public fb= inject(FormBuilder);
              public meta= inject(Meta);
              private route= inject(ActivatedRoute);
              private router= inject(Router);
              private cdRef= inject(ChangeDetectorRef);
  constructor() {
    this.settings = this.appSettings.createNew();
}

  ngOnInit() {
    this.isLoading = true;
    combineLatest([this.categoriesBS.asObservable(), this.route.params]).subscribe((x: any) => {  
      if(+x[1]["tab"] !== 0) {
        return;
        
      }    
      if (x[0].length > 0 &&
         (
          (x[1]["search"] && x[1]["search"].toString() !== 'null')||
          (x[1]["categories"] && x[1]["categories"].toString() !== 'null'))) {
        this.getProjects(x[0],+x[1]["page"],x[1]["search"], x[1]["categories"], this.designOffice.contentItemId);
      } else if(x[1]["search"] && x[1]["search"].toString() === 'null' &&
       x[1]["categories"] && x[1]["categories"].toString() === 'null') {
        this.router.navigate(['/designoffices',this.designOffice.contentItemId,0, this.searchFields.pageQuery.currentPage + 1, this.designOffice.displayText]);

      }
      else if (+x[1]["page"] && !x[1]["search"] && !x[1]["categories"] ){ 
        this.searchFields.designerId = this.designOffice.contentItemId   ;   
        
        
        this.projectService.getDesignOfficeProjects(this.searchFields, `{from: ${(+x[1]["page"] - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, designoffice: '${this.designOffice.contentItemId}', fulltext: ''}`).subscribe((y:any) => {
          this.searchFields.pageQuery.totalItems = y[0].count
          this.message = y[0].count === 0 ? "موردی یافت نشد" : '';
          this.projects = y[1].getDesignOfficeProjects;
          this.isLoading = false;
        });
      }
    })
  }

  openZoom(event: any, show: boolean) {
  }

  ngOnDestroy() {
  }
  public getProjects(cats: any[], currentPage: number, search: string, categories: { replace: (arg0: string, arg1: string) => { (): any; new(): any; split: { (arg0: string): { (): any; new(): any; length: number; includes: { (arg0: any): any; new(): any; }; join: { (arg0: string): any; new(): any; }; }; new(): any; }; }; }, designerId: any) {
    this.searchFields = new DesignOfficeProjectSearch({
      searchId: 1,
      designerId: designerId,
      categories: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter((x: { categoryId: { toString: () => any; }; }) => {
      if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
        return x;
      }
    }) : [],
    pageQuery: new Pagination(currentPage - 1, this.count, 0, 0)
    })
    this.projectService.getDesignOfficeProjects(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''} ${categories ? categories.replace('null', '').split('_').join(' ') : ''}'}`).subscribe((x:any) => {
      this.projects = x.searchProjects
    });
    
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    // this.config = {
    //   observer: false,
    //   slidesPerView: 1,
    //   spaceBetween: 0,
    //   keyboard: true,
    //   navigation: true,
    //   pagination: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   autoplay: {
    //     delay: 5000,
    //     disableOnInteraction: false
    //   }
    // };

    // this.config2 = {
    //   observer: false,
    //   slidesPerView: 4,
    //   spaceBetween: 16,
    //   keyboard: true,
    //   navigation: false,
    //   pagination: false,
    //   grabCursor: true,
    //   loop: false,
    //   preloadImages: false,
    //   lazy: true,
    //   breakpoints: {
    //     480: {
    //       slidesPerView: 2
    //     },
    //     600: {
    //       slidesPerView: 3,
    //     }
    //   }
    // };

  }

  public onOpenedChange() {
    // this.swipers.forEach(swiper => {
    //   if (swiper) {
    //     swiper.update();
    //   }
    // });
  }

  public selectImage(index: number) {
    // this.swipers.forEach(swiper => {
    //   if (swiper['elementRef'].nativeElement.id === 'main-carousel') {
    //     swiper.setIndex(index);
    //   }
    // });
  }

  public onIndexChange(index: number) {
    // this.swipers.forEach(swiper => {
    //   const elem = swiper['elementRef'].nativeElement;
    //   if (elem.id === 'small-carousel') {
    //     swiper.setIndex(index);
    //     for(let i = 0; i < elem.children[0].children.length; i++) {
    //       const element = elem.children[0].children[i];
    //       if (element.classList.contains('thumb-' + index)) {
    //         element.classList.add('active-thumb');
    //       } else {
    //         element.classList.remove('active-thumb');
    //       }
    //     }
    //   }
    // });
  }
  public searchChanged(event: { valueChanges: { subscribe: (arg0: () => void) => void; }; value: { categories: string | any[]; searchBox: string | any[]; }; }) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      if (this.designOffice) {
        this.searchFields = new DesignOfficeProjectSearch({
          searchId: 1,
          categories: event.value.categories &&
             event.value.categories.length > 0 ? event.value.categories : [],
          designerId: this.designOffice.contentItemId,
          searchBox: event.value.searchBox &&
          event.value.searchBox.length > 0 ? event.value.searchBox : '',
        });
        setTimeout(() => {
          this.removedSearchField = '';
        });
        if (!this.settings.searchOnBtnClick) {
          this.router.navigate(['/designoffices',this.designOffice.contentItemId,0, 1,  this.designOffice.displayText, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categories.length > 0 ? this.searchFields.categories.map(x => 'ProjectType-'+x.id).join('_') : 'null'}]);
        
        }
      }
      
    });
   
  }
  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new DesignOfficeProjectSearch({
      searchId: 1,
      designerId: this.designOffice.officeId,
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
  }



  public changeCount(count: number) {
    this.count = count;
    this.resetPagination();
    this.getDesignOfficeVideos();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    this.getDesignOfficeVideos();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.searchFields = new DesignOfficeProjectSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    this.router.navigate(['/designoffices',this.designOffice.contentItemId,0, this.searchFields.pageQuery.currentPage + 1,  this.designOffice.displayText, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categories.length > 0 ? this.searchFields.categories.map(x => 'ProjectCategory-'+x.id).join('_') : 'null'}]);
    window.scrollTo(0, 0);
  }

  public removeSearchField(field: string) {
    this.message = '';
    this.removedSearchField = field;
  }
  public getDesignOfficeVideos() {
   this.dataSource.loadOfficeVideos();
  }

}
