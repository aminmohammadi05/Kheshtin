
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { ProductsService } from './products.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap, withLatestFrom } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { CollectionViewer } from '@angular/cdk/collections';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { PaginationComponent } from 'ngx-bootstrap/pagination/public_api';
import { AuthService } from './auth.service';
import { DesignMoodBoardProduct } from '../models/design-mood-board-product';

export class MoodBoardProductDataSource implements DataSource<DesignMoodBoardProduct> {
    private productsSubject = new BehaviorSubject<DesignMoodBoardProduct[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public products$ = this.productsSubject.asObservable();

    constructor(private productService: ProductsService,  private authService: AuthService) {

    }

    loadProducts( ) {
                //     this.store.pipe( select(getDesignMoodBoardProductsPageLoaded()),
                //     tap((product) => {
                //         this.productsSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 9, 0, null));
                //         if (product.filteredProducts.length > 0 ) {
                //             if (product.allSearches[0]) {
                //                 this.paginationSubject.next(product.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.productsSubject.next(product.filteredProducts);
                //         } else if (product.allSearches[0].pageQuery.totalItems !== 0) {
                //             if (this.authService.loggedIn()) {
                //                 this.store.dispatch(new RefreshDesignMoodBoardProductPageAuthRequest(
                //                 'filter=',
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].brandsBox &&
                //                 product.allSearches[0].brandsBox[0] ? product.allSearches[0].brandsBox : [],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].categoriesBox &&
                //                 product.allSearches[0].categoriesBox[0] ?
                //                 product.allSearches[0].categoriesBox : [],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].colorsBox &&
                //                 product.allSearches[0].colorsBox[0] ?
                //                 product.allSearches[0].colorsBox : [],
                //                 product.allSearches[0] &&
                //                 product.allSearches[0].materialsBox &&
                //                 product.allSearches[0].materialsBox[0] ? product.allSearches[0].materialsBox : [],
                //                 product.allSearches[0].pageQuery,
                //                 this.authService.getDecodedToken().nameid));
                //             }
                //       }
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<DesignMoodBoardProduct[]> {
  
        return this.productsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
