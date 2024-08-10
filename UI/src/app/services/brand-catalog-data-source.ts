
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap, withLatestFrom } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { PaginationComponent } from 'ngx-bootstrap/pagination/public_api';
import { AuthService } from './auth.service';
import { debounce } from 'lodash';
import { BrandCatalog } from '../models/brand-catalog';
import { BrandCatalogService } from './brand-catalog.service';
import { CollectionViewer } from '@angular/cdk/collections';

export class BrandCatalogDataSource implements DataSource<BrandCatalog> {
    private brandCatalogsSubject = new BehaviorSubject<BrandCatalog[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public brandCatalogs$ = this.brandCatalogsSubject.asObservable();

    constructor(private brandCatalogService: BrandCatalogService, private authService: AuthService) {

    }

    loadBrandCatalogs( ) {
                //     this.store.pipe( select(getOneBrandCatalogs()),
                //     tap((brandCatalog) => {
                //         this.brandCatalogsSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (brandCatalog.allCatalogs.length > 0 ) {
                //             if (brandCatalog.allSearches[0]) {
                //                 this.paginationSubject.next(brandCatalog.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.brandCatalogsSubject.next(brandCatalog.allCatalogs);
                //         } else if (brandCatalog.allSearches[0].pageQuery.totalItems !== 0) { 
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshBrandCatalogAuthRequest(
                //               this.authService.getDecodedToken().nameid,
                //               brandCatalog.allSearches[0] &&
                //               brandCatalog.allSearches[0].searchBox ? brandCatalog.allSearches[0].searchBox : 'filter=',
                //               brandCatalog.allSearches[0] &&
                //               brandCatalog.allSearches[0].brandId ? brandCatalog.allSearches[0].brandId : '',
                //               brandCatalog.allSearches[0].pageQuery));
                //           } else {
                //               this.store.dispatch(new RefreshBrandCatalogRequest(
                //                 brandCatalog.allSearches[0] &&
                //                 brandCatalog.allSearches[0].searchBox ? brandCatalog.allSearches[0].searchBox : 'filter=',
                //                 brandCatalog.allSearches[0] &&
                //                 brandCatalog.allSearches[0].brandId ? brandCatalog.allSearches[0].brandId : '',
                //                 brandCatalog.allSearches[0].pageQuery));
                //           }
                //       }
                      
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<BrandCatalog[]> {
      
        return this.brandCatalogsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.brandCatalogsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
