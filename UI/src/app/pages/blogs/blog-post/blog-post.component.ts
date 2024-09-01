import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList, OnDestroy, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
// import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import {  } from 'ngx-scrollbar';
import { DomSanitizer, Meta } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Lightbox } from 'ngx-lightbox';
import { orderBy } from 'lodash';
import { NgxMasonryModule, NgxMasonryOptions } from 'ngx-masonry';
import { CommonModule } from '@angular/common';

import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SimilarBlogsCarouselComponent } from '../../../shared/similar-blogs-carousel/similar-blogs-carousel.component';
import { getImagesWithAbsolutePath, myDomain} from '../../../services/helpers/urlHelper';
import { Settings } from 'http2';
import { AppSettings } from '../../../app.settings';
import { AuthService } from '../../../services/auth.service';
import { BasicDataService } from '../../../services/basic-data.service';
import { BlogService } from '../../../services/blog.service';
import { BlogBagTypePipe } from '../../../theme/pipes/blog-bag.pipe';
import { OrderByPipe } from '../../../theme/pipes/order-by.pipe';
import { Album } from '../../../models/album';


@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatCardModule,MatSidenavModule, MatChipsModule, MatListModule, MatFormFieldModule, NgxMasonryModule, SimilarBlogsCarouselComponent, BlogBagTypePipe, OrderByPipe],
})
export class BlogPostComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  // @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig = {
    wheelPropagation: true
  };
  public sidenavOpen = false;
  // public config: SwiperConfigInterface = {};
  // public config2: SwiperConfigInterface = {};
  private sub: any;
  public blog: any;


  public relatedBlogs!: any[];
  public featuredBlogs!: any[];
  public agent: any;
  public mortgageForm!: FormGroup;
  public monthlyPayment: any;
  public contactForm!: FormGroup;
  private _albums!: Album[];
  public myOptions: NgxMasonryOptions = {
    gutter: 10,
    // fitWidth: true
    columnWidth:2, 
    percentPosition: true
  };

  public appSettings = inject(AppSettings);

  public basicService= inject(BasicDataService);
  private authService= inject(AuthService);

  private activatedRoute= inject(ActivatedRoute);
  private router= inject(Router);
  private blogService= inject(BlogService);
  private cdRef= inject(ChangeDetectorRef);
public settings= this.appSettings.createNew();
 
             
              
            
          
             
             
             
              public fb = inject(FormBuilder);
              private sanitized = inject(DomSanitizer);
              private _lightbox = inject(Lightbox);
              private meta = inject(Meta);
  constructor() {
   
    
  }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
    
      if (params['blogId']) {
        this.getBlogById(params['blogId']);
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

  public getBlogById(id: any) {
    this.blogService.getBlogById(id).subscribe(x => {
      this.blog = x.blog[0];
      orderBy(this.blog?.bag.contentItems.filter((x: { __typename: string; }) => x.__typename === 'BlogImage'), ['priority'], ['asc']).map((x, i) => {
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
      // this.config.observer = true;
      // this.config2.observer = true;
      // this.swipers.forEach(swiper => {
      //   if (swiper) {
      //     swiper.setIndex(0);
      //   }
      // });
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
    //   let elem = swiper['elementRef'].nativeElement;
    //   if (elem.id === 'small-carousel') {
    //     swiper.setIndex(index);
    //     for (let i = 0; i < elem.children[0].children.length; i++) {
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

  open(index: number): void {
    this._lightbox.open(this._albums, index);
  }


  public getRelatedBlogs() {
    this.blogService.getRelatedBlogs(`{ from:0, size: 10, fulltext:'${this.blog.hashtagList.contentItems.map((x: { searchField: any; }) => x.searchField).join(' ')}'}` ).subscribe(x => {
      this.relatedBlogs = x.getRelatedBlogs.filter((y: { contentItemId: any; }) => y.contentItemId !== this.blog.contentItemId);
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
  getHtml(value: any) {
    return getImagesWithAbsolutePath(value, myDomain);
  } 
}


