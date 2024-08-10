import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings, Settings } from 'src/app/app.settings';
import { CompareOverviewComponent } from 'src/app/shared/compare-overview/compare-overview.component';
import { EmbedVideoService } from 'ngx-embed-video';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { Blog } from 'src/app/models/blog';
import { BlogService } from 'src/app/services/blog.service';
import { BlogKeyword } from 'src/app/models/blog-keyword';
import * as uuid from 'uuid';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { getImagesWithAbsolutePath, myDomain} from 'src/app/services/helpers/urlHelper';
import { Lightbox } from 'ngx-lightbox';
import { orderBy } from 'lodash';
import { NgxMasonryOptions } from 'ngx-masonry';
import { BasicDataService } from 'src/app/services/basic-data.service';


@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public sidenavOpen = false;
  public config: SwiperConfigInterface = {};
  public config2: SwiperConfigInterface = {};
  private sub: any;
  public blog: any;
  public settings: Settings;
  public embedVideo: any;
  public relatedBlogs: any[];
  public featuredBlogs: any[];
  public agent: any;
  public mortgageForm: FormGroup;
  public monthlyPayment: any;
  public contactForm: FormGroup;
  private _albums = [];
  public myOptions: NgxMasonryOptions = {
    gutter: 10,
    // fitWidth: true
    columnWidth:2, 
    percentPosition: true
  };
  constructor(public appSettings: AppSettings,
              public blogService: BlogService,
              public basicService: BasicDataService,
              private activatedRoute: ActivatedRoute,
              private embedService: EmbedVideoService,
              private authService: AuthService,
              private cdr: ChangeDetectorRef,
              private router: Router,
              public fb: FormBuilder,
              private sanitized: DomSanitizer,
              private _lightbox: Lightbox,
              private meta: Meta) {
    this.settings = this.appSettings.settings;
    
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
    
      if (params.blogId) {
        this.getBlogById(params.blogId);
        // this.blog = this.store.pipe(select(getBlogById(params.blogId)));
        
      } else {
        this.router.navigate(['/**']);
      }
    });

    if (window.innerWidth < 960 && this.sidenav) {
      this.sidenavOpen = false;
      this.sidenav.close();
    }
    
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  public getBlogById(id) {
    this.blogService.getBlogById(id).subscribe(x => {
      this.blog = x.blog[0];
      orderBy(this.blog?.bag.contentItems.filter(x => x.__typename === 'BlogImage'), ['priority'], ['asc']).map((x, i) => {
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
      
      this.getRelatedBlogs();
      //   this.getFeaturedBlogs();
     });
    
    setTimeout(() => {
      this.config.observer = true;
      this.config2.observer = true;
      this.swipers.forEach(swiper => {
        if (swiper) {
          swiper.setIndex(0);
        }
      });
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
      let elem = swiper['elementRef'].nativeElement;
      if (elem.id === 'small-carousel') {
        swiper.setIndex(index);
        for (let i = 0; i < elem.children[0].children.length; i++) {
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

  open(index: number): void {
    this._lightbox.open(this._albums, index);
  }


  public getRelatedBlogs() {
    this.blogService.getRelatedBlogs(`{ from:0, size: 10, fulltext:'${this.blog.hashtagList.contentItems.map(x => x.searchField).join(' ')}'}` ).subscribe(x => {
      this.relatedBlogs = x.getRelatedBlogs.filter(y => y.contentItemId !== this.blog.contentItemId);
    });

  }

  public getFeaturedBlogs() {
    // this.blogService.getFeaturedBlogs().subscribe(blogs => {
    //   this.featuredBlogs = blogs.slice(0, 3);
    // });
  }

  tagClick(tag: any) {
   
      this.router.navigate(['/blogs/1', {hashtag: tag.searchField ? this.basicService.encode(JSON.stringify(tag)) : null, categories: 'null', search: 'null'}]);
   
  }
  getHtml(value) {
    return getImagesWithAbsolutePath(value, myDomain);
  } 
}
