
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap, withLatestFrom } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { PaginationComponent } from 'ngx-bootstrap/pagination/public_api';
import { AuthService } from './auth.service';
import { debounce } from 'lodash';
import { CollectionViewer } from '@angular/cdk/collections';
import { BrandProduct } from '../models/brand-product';
import { ProductsService } from './products.service';

export class BrandProductDataSource implements DataSource<BrandProduct> {
    private productsSubject = new BehaviorSubject<BrandProduct[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public products$ = this.productsSubject.asObservable();

    constructor(private productService: ProductsService,private authService: AuthService) {

    }

    loadBrandProducts( ) {
                //     this.store.pipe( select(getBrandProductsPageLoaded()),
                //     tap((product) => {
                //         this.productsSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (product.filteredBrandProducts.length > 0 ) {
                //             if (product.allSearches[0]) {
                //                 this.paginationSubject.next(product.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.productsSubject.next(product.filteredBrandProducts);
                //         } else if (product.allSearches[0].pageQuery.totalItems !== 0) {
                //             if (this.authService.loggedIn()) {
                //                 this.store.dispatch(new RefreshBrandProductPageAuthRequest(
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].searchBox ? product.allSearches[0].searchBox : 'filter=',
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].brandsBox &&
                //                 product.allSearches[0].brandsBox[0] ? product.allSearches[0].brandsBox : [],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].categoriesBoxNested &&
                //                 product.allSearches[0].categoriesBoxNested[0] ?
                //                 product.allSearches[0].categoriesBoxNested : [],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].brandCollectionBox &&
                //                 product.allSearches[0].brandCollectionBox[0] ?
                //                 product.allSearches[0].brandCollectionBox : [],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].fileTypes &&
                //                 product.allSearches[0].fileTypes[0] ? product.allSearches[0].fileTypes : ['-1'],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].imageUploaded,
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].pageQuery,
                //                 this.authService.getDecodedToken().nameid));
                //             } else {
                //                 this.store.dispatch(new RefreshBrandProductPageRequest(
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].searchBox ? product.allSearches[0].searchBox : 'filter=',
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].brandsBox &&
                //                 product.allSearches[0].brandsBox[0] ? product.allSearches[0].brandsBox : [],                                
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].categoriesBoxNested &&
                //                 product.allSearches[0].categoriesBoxNested[0] ?
                //                 product.allSearches[0].categoriesBoxNested : [],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].brandCollectionBox &&
                //                 product.allSearches[0].brandCollectionBox[0] ?
                //                 product.allSearches[0].brandCollectionBox : [],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].fileTypes &&
                //                 product.allSearches[0].fileTypes[0] ? product.allSearches[0].fileTypes : ['-1'],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].imageUploaded,
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].pageQuery));
                //             }
                //       }
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<BrandProduct[]> {

        return this.productsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
