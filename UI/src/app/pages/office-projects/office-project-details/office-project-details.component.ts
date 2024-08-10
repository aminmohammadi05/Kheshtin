import { Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList, OnDestroy, AfterViewInit, HostListener, ChangeDetectorRef, Input, Inject, ElementRef, Renderer2 } from '@angular/core';
import { OfficeProject } from 'src/app/models/office-project';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Meta } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { User } from 'src/app/models/user';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { AppSettings, Settings } from 'src/app/app.settings';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { tap, map, mergeMap } from 'rxjs/operators';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { Product } from 'src/app/models/product';
import { DesignOffice } from 'src/app/models/design-office';
import * as moment from 'jalali-moment'; // add this 1 of 4
import { OfficeProjectImage } from 'src/app/models/office-project-image';
import { OfficeProjectProduct } from 'src/app/models/office-project-product';
import * as uuid from 'uuid';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OfficeProjectService } from 'src/app/services/office-project.service';
import { getImagesWithAbsolutePath, myDomain} from 'src/app/services/helpers/urlHelper';
import { NgxMasonryOptions } from 'ngx-masonry';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav } from '@angular/material/sidenav';
import { Lightbox } from 'ngx-lightbox';
import { BasicDataService } from 'src/app/services/basic-data.service';

export interface OfficeProjectImageData {
  officeProject: Observable<OfficeProject>;
  index: number;
}
@Component({
  selector: 'app-office-project-details',
  templateUrl: './office-project-details.component.html',
  styleUrls: ['./office-project-details.component.scss']
})
export class OfficeProjectDetailsComponent implements OnInit, OnDestroy, AfterViewInit  {
  viewType: string = 'grid';
  viewCol: number = 25;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  @ViewChild('stickyCard', { static: true }) stickyCard: ElementRef;
  @ViewChild('delimiter', { static: true }) delimiter: ElementRef;
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  public config: SwiperConfigInterface = {};
  public config2: SwiperConfigInterface = {};
  private sub: any;
  public project: any;
  public settings: Settings;
  public embedVideo: any;
  public relatedOfficeProjects: any[];
  public featuredOfficeProjects: any[];
  public mortgageForm: FormGroup;
  public monthlyPayment: any;
  public contactForm: FormGroup;
  public productIdList: Observable<string[]>;
  public productList: any[];
  public myOptions: NgxMasonryOptions = {
    gutter: 10,
    fitWidth: true
  };
  private _albums = [];

  projectId: string;
  projectImage: string;
  constructor(public appSettings: AppSettings,
              private activatedRoute: ActivatedRoute,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router,
              private authService: AuthService,
              private renderer: Renderer2,
              private cdr: ChangeDetectorRef,
              public infoReq: MatDialog,
              public officeProjectService: OfficeProjectService,
              private observer: BreakpointObserver,
              public basicService: BasicDataService,
              private _lightbox: Lightbox,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {     
      if (params.projectId) {
        this.projectId = params.projectId;
        this.getOfficeProject(this.projectId);       
        
      } else {
        this.router.navigate(['/**']);
      }
    });

  }

  openZoom(event: any, show: boolean) {
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

 
  public getOfficeProject(id) {
    this.officeProjectService.getOfficeProjectById(id).subscribe(x => {
      this.project = x.project[0];
      this.project?.bag.contentItems.filter(x => x.__typename === 'ProjectImage').map((x, i) => {
        const src = "https://orchard.kheshtin.ir" +x.image.urls[0];
        const caption = x.userTitle;
        const thumb = "https://orchard.kheshtin.ir" +x.image.urls[0];
        const album = {
           src: src,
           caption: caption,
           thumb: thumb
        };
  
        this._albums.push(album);
      })
      this.getRelatedOfficeProjects();
        this.getFeaturedOfficeProjects();
     });
    

  }

  ngAfterViewInit() {
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
    this.observer.observe(["(max-width: 800px)"]).subscribe((res) => {
      if (res.matches) {
        this.sidenav.mode = "over";
        this.sidenav.close();
      } else {
        this.sidenav.mode = "side";
        this.sidenav.open();
      }
    });

  }


  public onOpenedChange() {
    this.swipers.forEach(swiper => {
      if (swiper) {
        swiper.update();
      }
    });
  }
  public getCategoriesNames() {
    return this.project ? this.project.projectType.contentItems.map(x => x.displayText).join(', ') : '';

  }
  public getImagesWithAbsPath(htmlText: string){
    return getImagesWithAbsolutePath(htmlText, myDomain);
  }
  public getOfficeProjectImages(project){
    return project?.bag.contentItems.filter(x => x.__typename === "ProjectImage");
  }
  open(index: number): void {
    this._lightbox.open(this._albums, index);
  }
  public openProjectImageDialog(index) {
    this.infoReq.open(OfficeProjectImageViewDialogComponent, {
      width: '90vw',
      height: '90vh',
      data: {
        officeProject: this.project,
        index: index
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

  public getRelatedOfficeProjects() {
    this.officeProjectService.getRelatedOfficeProjects(`{from: 0, size: 10, fulltext:'${this.project.projectType.contentItems.map(x => x.id).join(' ')}  ${(this.project)?.hashtagList.contentItems ? (this.project)?.hashtagList.contentItems.map(x => x.searchField.replace('#', '')).join(' ') : ''}'}`).subscribe((y:any) => {
      this.relatedOfficeProjects = y.searchProjects.filter(p => p.contentItemId !== this.project.contentItemId)
    });

  }


  public getFeaturedOfficeProjects() {
    // this.productService.getFeaturedProducts().subscribe(products => {
    //   this.featuredProducts = products.slice(0, 3);
    // });
  }

  public changeDateToFa(date) {
    if (date) {
      return moment(date).locale('fa').format('YYYY/MM/DD');
    }
  }
public getOfficeProjectCategoryName(project: OfficeProject) {
  if (project) {
   
  } else {
   
  }
}


public getImages(officeProjectImages: OfficeProjectImage[]): Observable<OfficeProjectImage[]> {
  if (officeProjectImages) {
    return of(officeProjectImages);
  } else {
    return of([]);
  }

}

public getSelectedImage(index): OfficeProjectImage {
  let image = null;
  // this.project.subscribe(x => {

  //   image = x ? x.officeProjectImageList[index] : null;
  // });
  return image;
}
tagClick(tag: any) {

   
  this.router.navigate(['/officeprojects/1', {hashtag: tag.searchField ? this.basicService.encode(JSON.stringify(tag)) : null, categories: 'null', search: 'null'}]);

}
}


@Component({
  selector: 'app-office-project-image-view-dialog',
  templateUrl: 'office-project-image-view-dialog.html',
})
export class OfficeProjectImageViewDialogComponent implements OnInit {
  public settings: Settings;
  public selectedIndex = 1;
  public selectedImageId: Observable<number>;
  officeProject: Observable<OfficeProject>;
  @Input() variant = 1;
  reqform: FormGroup;
  constructor(public appSettings: AppSettings,
              public dialogRef: MatDialogRef<OfficeProjectImageViewDialogComponent>,
              @Inject(MAT_DIALOG_DATA) public data: OfficeProjectImageData,
              public fb: FormBuilder) {
      this.settings = this.appSettings.settings;
}
ngOnInit() {
  this.selectedImageId = of(1);
  this.officeProject = this.data.officeProject;
  this.selectedIndex = this.data.index;

}
selectImage(index) {
  this.selectedIndex = index;
  let image = null;
  this.selectedImageId = this.officeProject.pipe(map(x => {

    image = x ? x.officeProjectImageList[index] : null;
    return image.imageId;
  }));
}

public getAppearance() {
  return (this.variant !== 3) ? 'outline' : '';
}
public getFloatLabel() {
  return (this.variant === 1) ? 'always' : '';
}

}
