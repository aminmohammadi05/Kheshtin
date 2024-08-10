import { DataSource } from '@angular/cdk/table';
import { BrandCategory } from '../models/brand-category';
import { BrandCategoryService } from './brand-category.service';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { PaginatedResult } from '../models/pagination';
import { CollectionViewer } from '@angular/cdk/collections';

export class BrandCategoryDataSource implements DataSource<BrandCategory> {

    private brandCategoriesSubject = new BehaviorSubject<BrandCategory[]>([]);
    private paginationSubject = new BehaviorSubject<number>(0);

    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public totalCount = 0;

    constructor(private brandCategoriesService: BrandCategoryService) {

    }

    loadBrandCategories(brandId: string, term: string, pageIndex: number,
                        pageSize: number) {
                    const rows = [];
                    this.loadingSubject.next(true);

                    this.brandCategoriesService.getBrandCategories(brandId, term, pageIndex, pageSize).pipe(
                catchError(() => of([])),
                finalize(() => this.loadingSubject.next(false))
            )
            .subscribe((brandCategories: PaginatedResult<BrandCategory[]>) => {
                if (brandCategories) {
                    brandCategories.result.forEach((element, i) => {
                        rows.push(element, { detailRow: true, element });
                    });
                    this.brandCategoriesSubject.next(rows);
                    this.paginationSubject.next(brandCategories.pagination.totalItems);
                }
            });

    }

    connect(collectionViewer: CollectionViewer): Observable<BrandCategory[]> {
  
        return this.brandCategoriesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.brandCategoriesSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
