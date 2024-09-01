import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, 
  inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MonoTypeOperatorFunction, Observable, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { MatTabGroup, MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { DesignOfficeProjectsComponent } from '../design-office-projects/design-office-projects.component';
import { DesignOfficeVideosComponent } from '../design-office-videos/design-office-videos.component';

import { AppSettings, Settings } from '../../../app.settings';
import { DesignOfficeProjectSearch } from '../../../models/design-office-project-search';
import { Pagination } from '../../../models/pagination';
import { Product } from '../../../models/product';
import { AuthService } from '../../../services/auth.service';
import { BasicDataService } from '../../../services/basic-data.service';
import { DesignOfficeService } from '../../../services/design-office.service';
import { getImagesWithAbsolutePath, myDomain } from '../../../services/helpers/urlHelper';
import { OfficeProjectService } from '../../../services/office-project.service';
import { ProductsService } from '../../../services/products.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';
import { RatingComponent } from '../../../shared/rating/rating.component';
import { emailValidator } from '../../../theme/utils/app-validators';

@Component({
  selector: 'app-design-office-detail',
  templateUrl: './design-office-detail.component.html',
  styleUrls: ['./design-office-detail.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatCardModule, MatChipsModule, MatTabsModule, MatButtonModule, MatSidenavModule, ReactiveFormsModule, MatProgressSpinnerModule, MatFormFieldModule, DesignOfficeVideosComponent, DesignOfficeProjectsComponent, RatingComponent, PaginationComponent],
})
export class DesignOfficeDetailComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  @ViewChild('tabGroup', { static: true })
  tabGroup!: MatTabGroup;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
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
  public totalProducts!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public selectedTab = 0;

  public searchFields: DesignOfficeProjectSearch = new DesignOfficeProjectSearch({
    searchId: 1,
    designerId: null,
    categories: [],
    pageQuery: new Pagination(0, 12, 0, 0),
    searchBox: 'filter='
  });
  public removedSearchField!: string;
  public isLoading = false;
  public pagination: Pagination = new Pagination(0, this.count, 0, 0);
  public message!: string;
  public messageCollection!: string;
  public messageCatalog!: string;
  public messageVideo!: string;
  public messageReseller!: string;
  public watcher!: Subscription;

  public settings: Settings;
  public relatedProducts!: Product[];
  public featuredProducts!: Product[];
  public contactForm!: FormGroup;
  designOfficeId!: string;
  designOfficeImage!: string;

  public appSettings = inject(AppSettings);
              public basicService= inject(BasicDataService);
              public designOfficeService= inject(DesignOfficeService);
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
    this.sub = this.route.params.subscribe(params => {
     
      if (params['designOfficeId']) {
        this.designOfficeId = params['designOfficeId'];
        this.getDesignOfficeById(this.designOfficeId, params['tab']);
        this.tabGroup.selectedIndex = +params['tab'];
       
        
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

  public getDesignOfficeById(id: string, tab: any) {
    
    
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



  public getProjectsByDesignOfficeId(id: any) {
   
  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new DesignOfficeProjectSearch({
      searchId: 1,
      pageQuery: new Pagination(0, this.count, 0, 0)
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
  public searchChanged(event: { valueChanges: { subscribe: (arg0: () => void) => void; pipe: (arg0: MonoTypeOperatorFunction<unknown>, arg1: MonoTypeOperatorFunction<unknown>) => { (): any; new(): any; subscribe: { (arg0: () => void): void; new(): any; }; }; }; value: { categories: string | any[]; searchBox: string | any[]; }; }) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      this.designOffice.subscribe((d: { officeId: any; }) => {
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
            this.removedSearchField = '';
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
  public removeSearchField(field: string) {
    this.message = '';
    this.removedSearchField = field;
  }


  public changeCount(count: number) {
    this.count = count;
    this.designOfficeProjects.length = 0;
    this.resetPagination();
    // this.getDesignOfficeProjects();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    this.designOfficeProjects.length = 0;
    // this.getDesignOfficeProjects();
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
getHtml(value: string) {
  return getImagesWithAbsolutePath(value, myDomain);
} 
  public openTab(event: number) {
   
    this.tabGroup.selectedIndex = event;
    this.router.navigate(['/designoffices', this.designOfficeId, this.tabGroup.selectedIndex, 1, this.designOffice.displayText]);
    // this.tabChanged.next(clickedIndex);
  }
}
