
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap, withLatestFrom } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { PaginationComponent } from 'ngx-bootstrap/pagination/public_api';
import { AuthService } from './auth.service';
import { debounce } from 'lodash';
import { BrandVideo } from '../models/brand-video';
import { BrandVideoService } from './brand-video.service';
import { CollectionViewer } from '@angular/cdk/collections';

export class BrandVideoDataSource implements DataSource<BrandVideo> {
    private brandVideosSubject = new BehaviorSubject<BrandVideo[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public brandVideos$ = this.brandVideosSubject.asObservable();

    constructor(private brandVideoService: BrandVideoService, private authService: AuthService) {

    }

    loadBrandVideos( ) {
                //     this.store.pipe( select(getOneBrandVideos()),
                //     tap((brandVideo) => {
                //         this.brandVideosSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (brandVideo.allVideos.length > 0 ) {
                //             if (brandVideo.allSearches[0]) {
                //                 this.paginationSubject.next(brandVideo.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.brandVideosSubject.next(brandVideo.allVideos);
                //         } else if (brandVideo.allSearches[0].pageQuery.totalItems !== 0) { 
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshBrandVideoAuthRequest(
                //               this.authService.getDecodedToken().nameid,
                //               brandVideo.allSearches[0] &&
                //               brandVideo.allSearches[0].brandId ? brandVideo.allSearches[0].brandId : '',
                //               brandVideo.allSearches[0] &&
                //               brandVideo.allSearches[0].searchBox ? brandVideo.allSearches[0].searchBox : '',
                //               brandVideo.allSearches[0].pageQuery));
                //           } else {
                //               this.store.dispatch(new RefreshBrandVideoRequest(
                //               brandVideo.allSearches[0] &&
                //               brandVideo.allSearches[0].brandId ? brandVideo.allSearches[0].brandId : '',
                //               brandVideo.allSearches[0] &&
                //               brandVideo.allSearches[0].searchBox ? brandVideo.allSearches[0].searchBox : '',
                //               brandVideo.allSearches[0].pageQuery));
                //           }
                //       }
                      
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<BrandVideo[]> {
  
        return this.brandVideosSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.brandVideosSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
