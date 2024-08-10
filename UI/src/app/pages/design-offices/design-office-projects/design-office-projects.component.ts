import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Property } from 'src/app/app.models';
import { Settings, AppSettings } from 'src/app/app.settings';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from 'src/app/app.service';
import { EmbedVideoService } from 'ngx-embed-video';
import { CompareOverviewComponent } from 'src/app/shared/compare-overview/compare-overview.component';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { BehaviorSubject, Observable, Subscription, combineLatest } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Pagination } from 'src/app/models/pagination';
import { MatPaginator } from '@angular/material/paginator';
import { Category } from 'src/app/models/category';
import { Search } from 'src/app/models/search';
import { DesignOfficeVideo } from 'src/app/models/design-office-video';
import { DesignOffice } from 'src/app/models/design-office';
import { OneOfficeVideoDataSource } from 'src/app/services/one-office-video-data-source';
import { DesignOfficeVideoService } from 'src/app/services/design-office-video.service';
import { OneOfficeVideoSearch } from 'src/app/models/one-office-video-search';
import { ProjectCategory } from 'src/app/models/project-category';
import { ProjectSearch } from 'src/app/models/project-search';
import { ProjectService } from 'src/app/services/project.service';
import { DesignOfficeProjectSearch } from 'src/app/models/design-office-project-search';

@Component({
  selector: 'app-design-office-projects',
  templateUrl: './design-office-projects.component.html',
  styleUrls: ['./design-office-projects.component.css']
})
export class DesignOfficeProjectsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() designOffice: any;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public categoriesBS : BehaviorSubject<ProjectCategory[]> = new BehaviorSubject([]);
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  public config: SwiperConfigInterface = {};
  public config2: SwiperConfigInterface = {};
  public projects: any[] = [];
  public totalVideos: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public isLoading = false;
  public searchFields: DesignOfficeProjectSearch = new DesignOfficeProjectSearch({
    searchId: 1,
    designerId: null,
    categories: [],
    pageQuery: new Pagination(0, 12, null, null),
    searchBox: ''
  });
  public message: string;
  public watcher: Subscription;
  public removedSearchField: string;
  public settings: Settings;
  public dataSource: OneOfficeVideoDataSource;

  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private route: ActivatedRoute,
              private router: Router,
              private embedService: EmbedVideoService,
              private officeVideoService: DesignOfficeVideoService,
              public fb: FormBuilder,
              private projectService: ProjectService,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
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
  public getProjects(cats, currentPage, search, categories, designerId) {
    this.searchFields = new DesignOfficeProjectSearch({
      searchId: 1,
      designerId: designerId,
      categories: categories && categories.replace('null', '').split('_').length > 0 ?  cats.filter(x => {
      if(categories.replace('null', '').split('_').includes(x.categoryId.toString())){
        return x;
      }
    }) : [],
    pageQuery: new Pagination(currentPage - 1, this.count, null, null)
    })
    this.projectService.getDesignOfficeProjects(this.searchFields, `{from: ${(currentPage - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${search ? search.replace('null', '') : ''} ${categories ? categories.replace('null', '').split('_').join(' ') : ''}'}`).subscribe((x:any) => {
      this.projects = x.searchProjects
    });
    
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();
    this.config = {
      observer: false,
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      }
    };

    this.config2 = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 16,
      keyboard: true,
      navigation: false,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    };

  }

  public onOpenedChange() {
    this.swipers.forEach(swiper => {
      if (swiper) {
        swiper.update();
      }
    });
  }

  public selectImage(index: number) {
    this.swipers.forEach(swiper => {
      if (swiper['elementRef'].nativeElement.id === 'main-carousel') {
        swiper.setIndex(index);
      }
    });
  }

  public onIndexChange(index: number) {
    this.swipers.forEach(swiper => {
      const elem = swiper['elementRef'].nativeElement;
      if (elem.id === 'small-carousel') {
        swiper.setIndex(index);
        for(let i = 0; i < elem.children[0].children.length; i++) {
          const element = elem.children[0].children[i];
          if (element.classList.contains('thumb-' + index)) {
            element.classList.add('active-thumb');
          } else {
            element.classList.remove('active-thumb');
          }
        }
      }
    });
  }
  public searchChanged(event) {
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
          this.removedSearchField = null;
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
      pageQuery: new Pagination(0, this.count, null, null)
    });
  }



  public changeCount(count) {
    this.count = count;
    this.resetPagination();
    this.getDesignOfficeVideos();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.getDesignOfficeVideos();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.searchFields = new DesignOfficeProjectSearch({
      searchId: 1,
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, null)
    });
    this.router.navigate(['/designoffices',this.designOffice.contentItemId,0, this.searchFields.pageQuery.currentPage + 1,  this.designOffice.displayText, {search: this.searchFields.searchBox ? this.searchFields.searchBox : 'null', categories: this.searchFields.categories.length > 0 ? this.searchFields.categories.map(x => 'ProjectCategory-'+x.id).join('_') : 'null'}]);
    window.scrollTo(0, 0);
  }

  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }
  public getDesignOfficeVideos() {
   this.dataSource.loadOfficeVideos();
  }

}
