import { Product } from '../models/product';
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
import { debounce } from 'lodash';
import { Search } from '../models/search';
import { BasicDataService } from './basic-data.service';

export class ProductsDataSource implements DataSource<Product> {
    private productsSubject = new BehaviorSubject<Product[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public products$ = this.productsSubject.asObservable();

    constructor(private productService: ProductsService,
         private authService: AuthService ) {

    }

    loadProducts( searchFields: Search) {
        this.productService.getProducts(searchFields, `{from: ${searchFields.pageQuery.currentPage * searchFields.pageQuery.itemsPerPage}, size: ${searchFields.pageQuery.itemsPerPage}, fulltext: '${searchFields.searchBox} ${searchFields.brandsBox.map(x => x.brandId).join(' ')} ${searchFields.brandCollectionBox.map(x => x.brandCollectionId).join(' ')} ${searchFields.categoriesBoxNested.map(x => x.categoryId).join(' ')}'}`)

}

    connect(collectionViewer: CollectionViewer): Observable<Product[]> {
        
        return this.productsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.productsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
