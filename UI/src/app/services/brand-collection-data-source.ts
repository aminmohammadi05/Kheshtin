
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
import { BrandCollection } from '../models/brand-collection';
import { BrandCollectionService } from './brand-collection.service';

export class BrandCollectionDataSource implements DataSource<BrandCollection> {
    private brandCollectionsSubject = new BehaviorSubject<BrandCollection[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public brandCollections$ = this.brandCollectionsSubject.asObservable();

    constructor(private brandCollectionService: BrandCollectionService, private authService: AuthService) {

    }

    loadBrandCollections( ) {
                //     this.store.pipe( select(getOneBrandCollections()),
                //     tap((brandCollection) => {
                //         this.brandCollectionsSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (brandCollection.allCollections.length > 0 ) {
                //             if (brandCollection.allSearches[0]) {
                //                 this.paginationSubject.next(brandCollection.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.brandCollectionsSubject.next(brandCollection.allCollections);
                //         } else if (brandCollection.allSearches[0].pageQuery.totalItems !== 0) { 
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshBrandCollectionAuthRequest(
                //               this.authService.getDecodedToken().nameid,
                //               brandCollection.allSearches[0] &&
                //               brandCollection.allSearches[0].brandId ? brandCollection.allSearches[0].brandId : '',
                //               brandCollection.allSearches[0] &&
                //               brandCollection.allSearches[0].searchBox ? brandCollection.allSearches[0].searchBox : '',
                //               brandCollection.allSearches[0].pageQuery));
                //           } else {
                //               this.store.dispatch(new RefreshBrandCollectionRequest(
                //               brandCollection.allSearches[0] &&
                //               brandCollection.allSearches[0].brandId ? brandCollection.allSearches[0].brandId : '',
                //               brandCollection.allSearches[0] &&
                //               brandCollection.allSearches[0].searchBox ? brandCollection.allSearches[0].searchBox : '',
                //               brandCollection.allSearches[0].pageQuery));
                //           }
                //       }
                      
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<BrandCollection[]> {
     
        return this.brandCollectionsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.brandCollectionsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
