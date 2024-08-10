
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
import { OfficeProjectService } from './office-project.service';
import { BrandOfficeProject } from '../models/brand-office-project';

export class BrandOfficeProjectsDataSource implements DataSource<BrandOfficeProject> {
    private brandOfficeProjectsSubject = new BehaviorSubject<BrandOfficeProject[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public brandOfficeProjects$ = this.brandOfficeProjectsSubject.asObservable();

    constructor(private brandOfficeProjectService: OfficeProjectService,  private authService: AuthService) {

    }

    loadBrandOfficeProjects( ) {
                //     this.store.pipe( select(getBrandOfficeProjectByBrandId()),
                //     tap((brandOfficeProject) => {
                //         if (brandOfficeProject.filteredProjects.length > 0 ) {
                //             if (brandOfficeProject.allSearches[0]) {
                //                 this.paginationSubject.next(brandOfficeProject.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.brandOfficeProjectsSubject.next(brandOfficeProject.filteredProjects);
                //         } else if (brandOfficeProject.allSearches[0].pageQuery.totalItems !== 0){ 
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshBrandOfficeProjectAuthRequest(
                //               this.authService.getDecodedToken().nameid,
                //               brandOfficeProject.allSearches[0] &&
                //               brandOfficeProject.allSearches[0].brandId ? brandOfficeProject.allSearches[0].brandId : 'empty',
                //               brandOfficeProject.allSearches[0].pageQuery));
                //           } else {
                //               this.store.dispatch(new RefreshBrandOfficeProjectRequest(
                //                 brandOfficeProject.allSearches[0] &&
                //                 brandOfficeProject.allSearches[0].brandId ? brandOfficeProject.allSearches[0].brandId : 'empty',
                //                 brandOfficeProject.allSearches[0].pageQuery));
                //           }
                //       }
                      
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<BrandOfficeProject[]> {
   
        return this.brandOfficeProjectsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.brandOfficeProjectsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
