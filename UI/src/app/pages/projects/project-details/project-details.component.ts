import { Component, OnInit, ViewChild, ViewChildren, QueryList, OnDestroy, AfterViewInit, HostListener } from '@angular/core';
import { Project } from 'src/app/models/project';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from 'src/app/services/project.service';
import { ProjectComment } from 'src/app/models/project-comment';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { User } from 'src/app/models/user';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { AppSettings, Settings } from 'src/app/app.settings';
import { PerfectScrollbarConfigInterface } from 'ngx-scrollbar';
import { tap, map } from 'rxjs/operators';
import { emailValidator } from 'src/app/theme/utils/app-validators';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit, OnDestroy, AfterViewInit  {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  public config: SwiperConfigInterface = {};
  public config2: SwiperConfigInterface = {};
  private sub: any;
  public project: Project;
  public settings: Settings;
  public embedVideo: any;
  public relatedProjects: Project[];
  public featuredProjects: Project[];
  public designer: Observable<User>;
  public mortgageForm: FormGroup;
  public monthlyPayment: any;
  public contactForm: FormGroup;




  projectId: string;
  projectImage: string;
  constructor(public appSettings: AppSettings,
              private activatedRoute: ActivatedRoute,
              public fb: FormBuilder,
              private router: Router,
              private route: ActivatedRoute,
              private authService: AuthService,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
}

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      var pattern=/^PRJ-\d{6}$/;
      if (pattern.test(params.projectId)) {
      this.projectId = params.projectId;
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

  public getProjectById(id) {
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

  public getDesigner(designerId) {
    // this.designer = this.store.select(getDesignerById(designerId));
  }

  public onContactFormSubmit(values: Object) {
    if (this.contactForm.valid) {
 
    }
  }

  public onMortgageFormSubmit(values: Object) {
    if (this.mortgageForm.valid) {
      const principalAmount = values['principalAmount'];
      const down = values['downPayment'];
      const interest = values['interestRate'];
      const term = values['period'];
      this.monthlyPayment = this.calculateMortgage(principalAmount, down, interest / 100 / 12, term * 12).toFixed(2);
    }
  }
  public calculateMortgage(principalAmount: any, downPayment: any, interestRate: any, period: any) {
    return ((principalAmount - downPayment) * interestRate) / (1 - Math.pow(1 + interestRate, -period));
  }


}
