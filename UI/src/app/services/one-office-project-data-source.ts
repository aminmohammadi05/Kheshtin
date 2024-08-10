
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
import { OfficeProject } from '../models/office-project';
import { OfficeProjectService } from './office-project.service';
import { DesignOfficeProject } from '../models/design-office-project';

export class OneOfficeProjectDataSource implements DataSource<OfficeProject> {
    private officeProjectsSubject = new BehaviorSubject<OfficeProject[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public officeProjects$ = this.officeProjectsSubject.asObservable();

    constructor(private officeProjectService: OfficeProjectService,  private authService: AuthService) {

    }

    loadOfficeProjects( ) {
                //     this.store.pipe( select(getOneDesignOfficeProjectsPageLoaded()),
                //     tap((officeProject) => {
                //         this.officeProjectsSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (officeProject.filteredProjects.length > 0 ) {
                //             if (officeProject.allSearches[0]) {
                //                 this.paginationSubject.next(officeProject.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.officeProjectsSubject.next(officeProject.filteredProjects);
                //         } else if (officeProject.allSearches[0] && officeProject.allSearches[0].pageQuery.totalItems !== 0){
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshDesignOfficeProjectPageAuthRequest(
                //                 officeProject.allSearches[0] &&
                //                 officeProject.allSearches[0].searchBox ? officeProject.allSearches[0].searchBox : 'filter=',
                //                 officeProject.allSearches[0] &&
                //                 officeProject.allSearches[0].designerId  ? officeProject.allSearches[0].designerId : 'empty',
                //                 officeProject.allSearches[0] &&
                //                 officeProject.allSearches[0].categories &&
                //                 officeProject.allSearches[0].categories.length > 0 ? officeProject.allSearches[0].categories : [],
                //                 officeProject.allSearches[0].pageQuery,
                //               this.authService.getDecodedToken().nameid));
                //           } else {
                //               this.store.dispatch(new RefreshDesignOfficeProjectPageRequest(
                //                 officeProject.allSearches[0] &&
                //                 officeProject.allSearches[0].searchBox ? officeProject.allSearches[0].searchBox : 'filter=',
                //                 officeProject.allSearches[0] &&
                //                 officeProject.allSearches[0].designerId ? officeProject.allSearches[0].designerId : 'empty',
                //                 officeProject.allSearches[0] &&
                //                 officeProject.allSearches[0].categories &&
                //                 officeProject.allSearches[0].categories.length > 0 ? officeProject.allSearches[0].categories : [],
                //                 officeProject.allSearches[0].pageQuery));
                //           }
                //       }

                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<DesignOfficeProject[]> {

        return this.officeProjectsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.officeProjectsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
