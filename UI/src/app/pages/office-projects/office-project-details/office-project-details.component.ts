import { Component,
  OnInit,
  ViewChild,
  ViewChildren,
  QueryList, OnDestroy, AfterViewInit, HostListener, ChangeDetectorRef, Input, Inject, ElementRef, Renderer2, 
  inject} from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { tap, map, mergeMap } from 'rxjs/operators';
import moment from 'jalali-moment'; // add this 1 of 4
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { NgxMasonryModule, NgxMasonryOptions } from 'ngx-masonry';
import { BreakpointObserver } from '@angular/cdk/layout';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { Lightbox } from 'ngx-lightbox';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

import { MatDividerModule } from '@angular/material/divider';

import { AppSettings, Settings } from '../../../app.settings';
import { OfficeProject } from '../../../models/office-project';
import { OfficeProjectImage } from '../../../models/office-project-image';
import { OfficeProjectImageData } from '../../../models/office-project-image-data';
import { AuthService } from '../../../services/auth.service';
import { BasicDataService } from '../../../services/basic-data.service';
import { getImagesWithAbsolutePath, myDomain } from '../../../services/helpers/urlHelper';
import { OfficeProjectService } from '../../../services/office-project.service';


@Component({
  selector: 'app-office-project-details',
  templateUrl: './office-project-details.component.html',
  styleUrls: ['./office-project-details.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSidenavModule, NgxMasonryModule, MatDividerModule, RouterModule]
})
export class OfficeProjectDetailsComponent implements OnInit, OnDestroy, AfterViewInit  {
  viewType: string = 'grid';
  viewCol: number = 25;
  @ViewChild(MatSidenav)
  sidenav!: MatSidenav;
  @ViewChild('stickyCard', { static: true })
  stickyCard!: ElementRef;
  @ViewChild('delimiter', { static: true })
  delimiter!: ElementRef;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  private sub: any;
  public project: any;
  public settings: Settings;
  public embedVideo: any;
  public relatedOfficeProjects!: any[];
  public featuredOfficeProjects!: any[];
  public mortgageForm!: FormGroup;
  public monthlyPayment: any;
  public contactForm!: FormGroup;
  public productIdList!: Observable<string[]>;
  public productList!: any[];
  public myOptions: NgxMasonryOptions = {
    gutter: 10,
    fitWidth: true
  };
  private _albums = [];

  projectId!: string;
  projectImage!: string;
  public appSettings= inject( AppSettings);
              private activatedRoute= inject( ActivatedRoute);
              public fb= inject( FormBuilder);
              private route= inject( ActivatedRoute);
              private router= inject( Router);
              private authService= inject( AuthService);
              private renderer= inject( Renderer2);
              private cdr= inject( ChangeDetectorRef);
              public infoReq= inject( MatDialog);
              public officeProjectService= inject( OfficeProjectService);
              private observer= inject( BreakpointObserver);
              public basicService= inject( BasicDataService);
              private _lightbox= inject( Lightbox);
              private meta= inject( Meta);
  constructor() {
    this.settings = this.appSettings.createNew();
}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {     
      if (params['projectId']) {
        this.projectId = params['projectId'];
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

 
  public getOfficeProject(id: string) {
    this.officeProjectService.getOfficeProjectById(id).subscribe(x => {
      this.project = x.project[0];
      this.project?.bag.contentItems.filter((x: { __typename: string; }) => x.__typename === 'ProjectImage').map((x: { image: { urls: string[]; }; userTitle: any; }, i: any) => {
        const src = "https://orchard.kheshtin.ir" +x.image.urls[0];
        const caption = x.userTitle;
        const thumb = "https://orchard.kheshtin.ir" +x.image.urls[0];
        const album = {
           src: src,
           caption: caption,
           thumb: thumb
        };
  
        // this._albums.push(album);
      })
      this.getRelatedOfficeProjects();
        this.getFeaturedOfficeProjects();
     });
    

  }

  ngAfterViewInit() {
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
    // this.swipers.forEach(swiper => {
    //   if (swiper) {
    //     swiper.update();
    //   }
    // });
  }
  public getCategoriesNames() {
    return this.project ? this.project.projectType.contentItems.map((x: { displayText: any; }) => x.displayText).join(', ') : '';

  }
  public getImagesWithAbsPath(htmlText: string){
    return getImagesWithAbsolutePath(htmlText, myDomain);
  }
  public getOfficeProjectImages(project: { bag: { contentItems: any[]; }; }){
    return project?.bag.contentItems.filter((x: { __typename: string; }) => x.__typename === "ProjectImage");
  }
  open(index: number): void {
    this._lightbox.open(this._albums, index);
  }
  public openProjectImageDialog(index: any) {
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

  public getRelatedOfficeProjects() {
    this.officeProjectService.getRelatedOfficeProjects(`{from: 0, size: 10, fulltext:'${this.project.projectType.contentItems.map((x: { id: any; }) => x.id).join(' ')}  ${(this.project)?.hashtagList.contentItems ? (this.project)?.hashtagList.contentItems.map((x: { searchField: string; }) => x.searchField.replace('#', '')).join(' ') : ''}'}`).subscribe((y:any) => {
      this.relatedOfficeProjects = y.searchProjects.filter((p: { contentItemId: any; }) => p.contentItemId !== this.project.contentItemId)
    });

  }


  public getFeaturedOfficeProjects() {
    // this.productService.getFeaturedProducts().subscribe(products => {
    //   this.featuredProducts = products.slice(0, 3);
    // });
  }

  public changeDateToFa(date: any) {
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

public getSelectedImage(index: any): OfficeProjectImage {
  let image = new OfficeProjectImage();
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
  public selectedImageId!: Observable<number>;
  officeProject!: Observable<OfficeProject>;
  @Input() variant = 1;
  reqform!: FormGroup;
  public appSettings= inject( AppSettings);
              public dialogRef= inject( MatDialogRef<OfficeProjectImageViewDialogComponent>);
              // @Inject(MAT_DIALOG_DATA) public data= inject(OfficeProjectImageData);
              public fb= inject( FormBuilder);
  constructor() {
      this.settings = this.appSettings.createNew();
}
ngOnInit() {
  this.selectedImageId = of(1);
  // this.officeProject = this.data!.officeProject;
  // this.selectedIndex = this.data!.index;

}
selectImage(index: number) {
  this.selectedIndex = index;
  let image = null;
  this.selectedImageId = this.officeProject.pipe(map(x => {

    image = x ? x.officeProjectImageList[index] : null;
    return image!.imageId;
  }));
}

public getAppearance() {
  return (this.variant !== 3) ? 'outline' : '';
}
public getFloatLabel() {
  return (this.variant === 1) ? 'always' : '';
}

}
