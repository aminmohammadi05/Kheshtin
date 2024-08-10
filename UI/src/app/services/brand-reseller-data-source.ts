
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap, withLatestFrom } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { PaginationComponent } from 'ngx-bootstrap/pagination/public_api';
import { AuthService } from './auth.service';
import { debounce } from 'lodash';
import { BrandReseller } from '../models/brand-reseller';
import { BrandResellerService } from './brand-reseller.service';
import { CollectionViewer } from '@angular/cdk/collections';

export class BrandResellerDataSource implements DataSource<BrandReseller> {
    private brandResellersSubject = new BehaviorSubject<BrandReseller[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public brandResellers$ = this.brandResellersSubject.asObservable();

    constructor(private brandResellerService: BrandResellerService, private authService: AuthService) {

    }

    loadBrandResellers( ) {
                //     this.store.pipe( select(getOneBrandResellers()),
                //     tap((brandReseller) => {
                //         this.brandResellersSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (brandReseller.allResellers.length > 0 ) {
                //             if (brandReseller.allSearches[0]) {
                //                 this.paginationSubject.next(brandReseller.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.brandResellersSubject.next(brandReseller.allResellers);
                //         } else if (brandReseller.allSearches[0].pageQuery.totalItems !== 0){ 
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshBrandResellerAuthRequest(
                //               this.authService.getDecodedToken().nameid,
                //               brandReseller.allSearches[0] &&
                //               brandReseller.allSearches[0].brandId ? brandReseller.allSearches[0].brandId : '',
                //               brandReseller.allSearches[0] &&
                //               brandReseller.allSearches[0].searchBox ? brandReseller.allSearches[0].searchBox : 'filter=',
                //               brandReseller.allSearches[0].pageQuery));
                //           } else {
                //               this.store.dispatch(new RefreshBrandResellerRequest(
                //               brandReseller.allSearches[0] &&
                //               brandReseller.allSearches[0].brandId ? brandReseller.allSearches[0].brandId : '',
                //               brandReseller.allSearches[0] &&
                //               brandReseller.allSearches[0].searchBox ? brandReseller.allSearches[0].searchBox : 'filter=',
                //               brandReseller.allSearches[0].pageQuery));
                //           }
                //       }
                      
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<BrandReseller[]> {
       
        return this.brandResellersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.brandResellersSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
