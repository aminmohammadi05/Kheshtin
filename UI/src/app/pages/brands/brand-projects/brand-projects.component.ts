import { Component, OnInit, OnDestroy, ViewChild,
  ViewChildren, QueryList, HostListener, AfterViewInit, ChangeDetectorRef, ElementRef, Renderer2, Input, 
  inject} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';
import { tap, map, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AppSettings, Settings } from '../../../app.settings';
import { BrandOfficeProjectSearch } from '../../../models/brand-office-project-search';
import { Pagination } from '../../../models/pagination';
import { AuthService } from '../../../services/auth.service';
import { BrandOfficeProjectsDataSource } from '../../../services/brand-office-project-data-source';
import { BrandService } from '../../../services/brand.service';
import { OfficeProjectService } from '../../../services/office-project.service';
import { PaginationComponent } from '../../../shared/pagination/pagination.component';

@Component({
  selector: 'app-brand-projects',
  templateUrl: './brand-projects.component.html',
  styleUrls: ['./brand-projects.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatChipsModule, MatListModule, MatFormFieldModule,  FlexLayoutModule, PaginationComponent],
})
export class BrandProjectsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @Input() brand: any;
  @Input()
  tabChanged!: Subject<number>;
  @ViewChild(MatPaginator, { static: true })
  paginator!: MatPaginator;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };

  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  public officeProjects: any[] = [];
  public allOfficeProjects: any[] = [];
  public totalOfficeProjects!: Observable<number>;
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort!: string;
  public isLoading = false;
  public pagination: Pagination = new Pagination(0, this.count, 0, 0);
  public message!: string;
  public watcher!: Subscription;

  public settings: Settings;
  public searchFields: BrandOfficeProjectSearch = new BrandOfficeProjectSearch({
    searchId: 1,
    categories: [],
    searchBox: 'filter=',
    designers: [],
    pageQuery: new Pagination(0, 12, 0, 0)
  });
  public dataSource!: BrandOfficeProjectsDataSource;
  public appSettings= inject( AppSettings);
              private route= inject( ActivatedRoute);
              private router= inject( Router);
              private brandService= inject( BrandService);
   
              public fb= inject( FormBuilder);
              private officeProjectService= inject( OfficeProjectService);
              private cdRef= inject( ChangeDetectorRef);
              private authService= inject( AuthService);
              private meta= inject( Meta);
  constructor(
    ) {
    this.settings = this.appSettings.createNew()
}

  ngOnInit() {
    this.isLoading = true;
    this.route.params.subscribe(x => {
      if(+x["tab"] !== 6)  {
        return;
      }
      if (+x["page"]) {
        this.searchFields = new BrandOfficeProjectSearch({
          searchId: 1,
          brandId: this.brand.contentItemId,
          searchBox: 'filter=',
          pageQuery: new Pagination(+x["page"], 12, 0, 0)
        });
        
        this.brandService.getProjectsByBrandId(this.searchFields, `{from: ${(+x["page"] - 1) * this.searchFields.pageQuery.itemsPerPage}, size: ${this.searchFields.pageQuery.itemsPerPage}, fulltext: '${this.brand.contentItemId}'}`).subscribe((y:any) => {
        
          this.searchFields.pageQuery.totalItems = y[0].count
          this.message = y[0].count === 0 ? "موردی یافت نشد" : '';
          this.officeProjects = y[1].getSelectedProjectsByBrandIdEls;
          this.isLoading = false;
        });
      }
    });
  }

  openZoom(event: any, show: boolean) {
  }

  ngOnDestroy() {
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
    this.getBrandProjects();
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

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.searchFields = new BrandOfficeProjectSearch({
      searchId: 1,
      pageQuery: new Pagination(0, this.count, 0, 0)
    });
    
  }



  public changeCount(count: number) {
    this.count = count;
    // this.officeProjects.length = 0;
    this.resetPagination();
    // this.getBrandProjects();
  }
  public changeSorting(sort: string) {
    this.sort = sort;
    // this.officeProjects.length = 0;
    // this.getBrandProjects();
  }
  public changeViewType(obj: { viewType: string; viewCol: number; }) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e: { pageIndex: number; pageSize: number; length: number; }) {
    this.pagination.currentPage = e.pageIndex ;
    this.searchFields = new BrandOfficeProjectSearch({
      searchId: 1,
      searchBox: 'filter=',
      pageQuery: new Pagination(e.pageIndex, e.pageSize, e.length, 0)
    });
    this.router.navigate(['/brands',  this.brand.contentItemId, 6, e.pageIndex + 1, this.brand.displayText]);
    window.scrollTo(0, 0);
  }

  public getBrandProjects() {
  
  }

}
