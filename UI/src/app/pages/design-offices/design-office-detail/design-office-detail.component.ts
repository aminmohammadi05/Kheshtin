import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductsService } from 'src/app/services/products.service';
import { Product } from 'src/app/models/product';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { Settings, AppSettings } from 'src/app/app.settings';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { AppService } from 'src/app/app.service';

import { emailValidator } from 'src/app/theme/utils/app-validators';
import { DesignOfficeService } from 'src/app/services/design-office.service';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { Pagination } from 'src/app/models/pagination';
import { MatPaginator } from '@angular/material/paginator';
import { OfficeProjectService } from 'src/app/services/office-project.service';
import { DesignOfficeProjectSearch } from 'src/app/models/design-office-project-search';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { getImagesWithAbsolutePath, myDomain} from 'src/app/services/helpers/urlHelper';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RatingComponent } from 'src/app/shared/rating/rating.component';
import { PaginationComponent } from 'src/app/shared/pagination/pagination.component';
import { DesignOfficeProjectsComponent } from '../design-office-projects/design-office-projects.component';
import { DesignOfficeVideosComponent } from '../design-office-videos/design-office-videos.component';

@Component({
  selector: 'app-design-office-detail',
  templateUrl: './design-office-detail.component.html',
  styleUrls: ['./design-office-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatChipsModule, MatTabsModule, MatButtonModule, MatSidenavModule, FlexLayoutModule, ReactiveFormsModule, MatProgressSpinnerModule, MatFormFieldModule, DesignOfficeVideosComponent, DesignOfficeProjectsComponent, RatingComponent, PaginationComponent],
})
export class DesignOfficeDetailComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  private sub: any;
  public designOffice: any; 
  public designOfficeProjects: any[] = [];
  public totalProducts: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public selectedTab = 0;

  public searchFields: DesignOfficeProjectSearch = new DesignOfficeProjectSearch({
    searchId: 1,
    designerId: null,
    categories: [],
    pageQuery: new Pagination(0, 12, null, null),
    searchBox: 'filter='
  });
  public removedSearchField: string;
  public isLoading = false;
  public pagination: Pagination = new Pagination(0, this.count, null, null);
  public message: string;
  public messageCollection: string;
  public messageCatalog: string;
  public messageVideo: string;
  public messageReseller: string;
  public watcher: Subscription;

  public settings: Settings;
  public relatedProducts: Product[];
  public featuredProducts: Product[];
  public contactForm: FormGroup;
  designOfficeId: string;
  designOfficeImage: string;

  constructor(public appSettings: AppSettings,
              public appService: AppService,
              private route: ActivatedRoute,
              public basicService: BasicDataService,
              private router: Router,
              
              public fb: FormBuilder,
             
              private productService: ProductsService,
              private projectService: OfficeProjectService,
              private designOfficeService: DesignOfficeService,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
     
      if (params.designOfficeId) {
        this.designOfficeId = params.designOfficeId;
        this.getDesignOfficeById(this.designOfficeId, params.tab);
        this.tabGroup.selectedIndex = +params.tab;
       
        
      } else {
        this.router.navigate(['/**']);
      }
    });
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
      this.sidenav.close();
    }

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  openZoom(event: any, show: boolean) {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  public getDesignOfficeById(id, tab) {
    
    
    this.designOfficeService.getDesignOfficeById(id).subscribe((x: any) => {
      this.designOffice = x.designOffice[0];     
      if (x.designOffice[0]){
        this.designOfficeService.getDesignOfficeTotalProjects(x.designOffice[0].displayText).subscribe(y => {
         
          this.designOffice.totalProjects = y.count;
        });
      }
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



  public getProjectsByDesignOfficeId(id) {
   
  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new DesignOfficeProjectSearch({
      searchId: 1,
      pageQuery: new Pagination(0, this.count, null, null)
    });
  }

  // public filterData(data) {
  //   return this.productService.filterData(data, this.searchFields, this.sort, this.pagination.currentPage, this.pagination.itemsPerPage);
  // }

  public searchClicked() {
    this.designOfficeProjects.length = 0;
    // this.getDesignOfficeProjects();
    window.scrollTo(0, 0);
  }
  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      this.designOffice.subscribe(d => {
        if (d) {
          this.searchFields = new DesignOfficeProjectSearch({
            searchId: 1,
            categories: event.value.categories &&
               event.value.categories.length > 0 ? event.value.categories : [],
            designerId: d.officeId,
            searchBox: event.value.searchBox &&
            event.value.searchBox.length > 0 ? event.value.searchBox : '',
          });
          setTimeout(() => {
            this.removedSearchField = null;
          });
          if (!this.settings.searchOnBtnClick) {
            this.designOfficeProjects.length = 0;
          }
        }
      });
      
    });
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        // this.getDesignOfficeProjects();
      }
    });
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }


  public changeCount(count) {
    this.count = count;
    this.designOfficeProjects.length = 0;
    this.resetPagination();
    // this.getDesignOfficeProjects();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.designOfficeProjects.length = 0;
    // this.getDesignOfficeProjects();
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
    // this.store.dispatch(new SaveDesignOfficeProjectSearchForRequest(this.searchFields));
    window.scrollTo(0, 0);
  }


  public onContactFormSubmit(values: Object) {
    if (this.contactForm.valid) {
     
    }
  }
  tagClick(tag: any) {
   
    this.router.navigate(['/designoffices/1', {hashtag: tag.searchField ? this.basicService.encode(JSON.stringify(tag)) : null, categories: 'null', search: 'null'}]);
 
}
getHtml(value) {
  return getImagesWithAbsolutePath(value, myDomain);
} 
  public openTab(event) {
   
    this.tabGroup.selectedIndex = event;
    this.router.navigate(['/designoffices', this.designOfficeId, this.tabGroup.selectedIndex, 1, this.designOffice.displayText]);
    // this.tabChanged.next(clickedIndex);
  }
}
