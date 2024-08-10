
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap, withLatestFrom } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { CollectionViewer } from '@angular/cdk/collections';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { PaginationComponent } from 'ngx-bootstrap/pagination/public_api';
import { AuthService } from './auth.service';
import { debounce } from 'lodash';
import { DesignOfficeVideoService } from './design-office-video.service';
import { DesignOfficeVideo } from '../models/design-office-video';

export class OneOfficeVideoDataSource implements DataSource<DesignOfficeVideo> {
    private officeVideosSubject = new BehaviorSubject<DesignOfficeVideo[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public officeVideos$ = this.officeVideosSubject.asObservable();

    constructor(private officeVideoService: DesignOfficeVideoService,  private authService: AuthService) {

    }

    loadOfficeVideos( ) {
                //     this.store.pipe( select(getOneDesignOfficeVideos()),
                //     tap((officeVideo) => {
                //         if (officeVideo.allVideos.length > 0 ) {
                //             if (officeVideo.allSearches[0]) {
                //                 this.paginationSubject.next(officeVideo.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.officeVideosSubject.next(officeVideo.allVideos);
                //         } else { 
                //             if (this.authService.loggedIn()) {
                //                 this.store.dispatch(new RefreshDesignOfficeVideoAuthRequest(
                //                 this.authService.getDecodedToken().nameid,
                //                 officeVideo.allSearches[0].designerId,
                //                 officeVideo.allSearches[0].searchBox,
                //                 officeVideo.allSearches[0].pageQuery
                //                 ));
                //             } else {
                //               this.store.dispatch(new RefreshDesignOfficeVideoRequest(
                //                 officeVideo.allSearches[0].designerId,
                //                 officeVideo.allSearches[0].searchBox,
                //                 officeVideo.allSearches[0].pageQuery));
                //             }
                //       }
                      
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<DesignOfficeVideo[]> {
        
        return this.officeVideosSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.officeVideosSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
