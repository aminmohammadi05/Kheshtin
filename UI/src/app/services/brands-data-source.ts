
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
import { Brand } from '../models/brand';
import { BrandService } from './brand.service';

export class BrandsDataSource implements DataSource<Brand> {
    private brandsSubject = new BehaviorSubject<Brand[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public brands$ = this.brandsSubject.asObservable();

    constructor(private brandService: BrandService,  private authService: AuthService) {

    }

    loadBrands( ) {
                //     this.store.pipe( select(getBrandsPageLoaded()),
                //     tap((brand) => {
                //         if (brand.filteredBrands.length > 0 ) {
                //             if (brand.allSearches[0]) {
                //                 this.paginationSubject.next(brand.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.brandsSubject.next(brand.filteredBrands);
                //         } else { 
                //             if (this.authService.loggedIn()) {
                //                 this.store.dispatch(new RefreshBrandPageAuthRequest(
                //                 brand.allSearches[0] &&
                //                 brand.allSearches[0].searchBox ? 'filter=' + brand.allSearches[0].searchBox : 'filter=',
                //                 brand.allSearches[0] &&
                //                 brand.allSearches[0].categoriesBoxNested &&
                //                 brand.allSearches[0].categoriesBoxNested[0] ?
                //                 brand.allSearches[0].categoriesBoxNested : [],
                //                 brand.allSearches[0] &&
                //                 brand.allSearches[0].brandCollectionBox &&
                //                 brand.allSearches[0].brandCollectionBox[0] ?
                //                 brand.allSearches[0].brandCollectionBox : [],
                //                 brand.allSearches[0].pageQuery,
                //                 this.authService.getDecodedToken().nameid));
                //             } else {
                //               this.store.dispatch(new RefreshBrandPageRequest(
                //                 brand.allSearches[0] &&
                //                 brand.allSearches[0].searchBox ? 'filter=' + brand.allSearches[0].searchBox : 'filter=',
                //                 brand.allSearches[0] &&
                //                 brand.allSearches[0].categoriesBoxNested &&
                //                 brand.allSearches[0].categoriesBoxNested[0] ?
                //                 brand.allSearches[0].categoriesBoxNested : [],
                //                 brand.allSearches[0] &&
                //                 brand.allSearches[0].brandCollectionBox &&
                //                 brand.allSearches[0].brandCollectionBox[0] ?
                //                 brand.allSearches[0].brandCollectionBox : [],
                //                 brand.allSearches[0].pageQuery));
                //             }
                //       }
                      
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<Brand[]> {

        return this.brandsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.brandsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
