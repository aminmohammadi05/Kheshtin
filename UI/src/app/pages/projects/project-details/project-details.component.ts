import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy, AfterViewInit, HostListener, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { tap, map } from 'rxjs/operators';
import { AppSettings, Settings } from '../../../app.settings';
import { Project } from '../../../models/project';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';
import { emailValidator } from '../../../theme/utils/app-validators';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  // public psConfig: PerfectScrollbarConfigInterface = {
  //   wheelPropagation: true
  // };
  public sidenavOpen = true;
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  private sub: any;
  public project!: Project;
  public settings: Settings;
  public embedVideo: any;
  public relatedProjects!: Project[];
  public featuredProjects!: Project[];
  public designer!: Observable<User>;
  public mortgageForm!: FormGroup;
  public monthlyPayment: any;
  public contactForm!: FormGroup;




  projectId!: string;
  projectImage!: string;
  public appSettings= inject( AppSettings);
              private activatedRoute= inject( ActivatedRoute);
              public fb= inject( FormBuilder);
              private router= inject( Router);
              private route= inject( ActivatedRoute);
              private authService= inject( AuthService);
              private meta= inject( Meta);
  constructor() {
    this.settings = this.appSettings.createNew()
}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      var pattern=/^PRJ-\d{6}$/;
      if (pattern.test(params['projectId'])) {
      this.projectId = params['projectId'];
      this.getProjectById(this.projectId);
      } else {
        this.router.navigate(['/**']);
      }
    });
    this.getRelatedProjects();
    this.getFeaturedProjects();
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
      this.sidenav.close();
    }
    this.mortgageForm = this.fb.group({
      principalAmount: ['', Validators.required],
      downPayment: ['', Validators.required],
      interestRate: ['', Validators.required],
      period: ['', Validators.required]
    });
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

  public getProjectById(id: string) {
    // this.store.pipe(select(getProjectById(id)),
    // tap(project => {
    //   if (project) {
    //     this.getDesigner(project.createUserId);
    //     this.project = project;
    //     this.meta.addTags([{name: 'keywords', content: project.keywordList + project.name + ',' + project.description}
    //     ]);
    //     this.projectImage = project.projectImageList[0].imageUrl;
    //     setTimeout(() => {
    //       this.config.observer = true;
    //       this.config2.observer = true;
    //       this.swipers.forEach(swiper => {
    //         if (swiper) {
    //           swiper.setIndex(0);
    //         }
    //       });
    //     });
    //   } else {
    //     if (this.authService.loggedIn()) {
    //       this.store.dispatch(new RefreshProjectByIdAuthRequest(this.authService.getDecodedToken().nameid, id));
    //     } else {
    //       this.store.dispatch(new RefreshProjectByIdRequest(id));
    //     }
    //   }
    // })).subscribe();
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
    // this.swipers.forEach((swiper: { update: () => void; }) => {
    //   if (swiper) {
    //     swiper.update();
    //   }
    // });
  }

  public selectImage(index: number) {
    // this.swipers.forEach((swiper: { [x: string]: { nativeElement: { id: string; }; }; setIndex: (arg0: number) => void; }) => {
    //   if (swiper['elementRef'].nativeElement.id === 'main-carousel') {
    //     swiper.setIndex(index);
    //   }
    // });
  }

  public onIndexChange(index: number) {
    // this.swipers.forEach((swiper: { [x: string]: { nativeElement: any; }; setIndex: (arg0: number) => void; }) => {
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

  public getRelatedProjects() {
    // this.store.pipe(select(getRelatedProjectsByCategory(this.project.projectCategorySetList)),
    // map(projects => {
    //   if (projects.length > 5) {
    //     this.relatedProjects = projects;
    //   } else {
    //     if (this.authService.loggedIn()) {
    //       this.store.dispatch(
    //         new GetRelatedProjectsByCategoryAuth(
    //           this.project.projectCategorySetList.map(x => x.projectCategoryId),
    //           this.authService.getDecodedToken().nameid));
    //     } else {
    //       this.store.dispatch(
    //         new GetRelatedProjectsByCategory(
    //           this.project.projectCategorySetList.map(x => x.projectCategoryId)));
    //     }
    //   }
    // })).subscribe();
    // this.productService.getRelatedProducts().subscribe(products => {
    //   this.relatedProducts = products;
    // });
  }

  public getFeaturedProjects() {
    // this.productService.getFeaturedProducts().subscribe(products => {
    //   this.featuredProducts = products.slice(0, 3);
    // });
  }

  public getDesigner(designerId: any) {
    // this.designer = this.store.select(getDesignerById(designerId));
  }

  public onContactFormSubmit(values: Object) {
    if (this.contactForm.valid) {
 
    }
  }

  public onMortgageFormSubmit(values: Object) {
    if (this.mortgageForm.valid) {
      // const principalAmount = values['principalAmount'];
      // const down = values['downPayment'];
      // const interest = values['interestRate'];
      // const term = values['period'];
      // this.monthlyPayment = this.calculateMortgage(principalAmount, down, interest / 100 / 12, term * 12).toFixed(2);
    }
  }
  public calculateMortgage(principalAmount: any, downPayment: any, interestRate: any, period: any) {
    return ((principalAmount - downPayment) * interestRate) / (1 - Math.pow(1 + interestRate, -period));
  }


}
