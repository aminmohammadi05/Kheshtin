
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { DesignOfficeService } from './design-office.service';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap, withLatestFrom } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { CollectionViewer } from '@angular/cdk/collections';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { PaginationComponent } from 'ngx-bootstrap/pagination/public_api';
import { AuthService } from './auth.service';
import { debounce } from 'lodash';
import { DesignOffice } from '../models/design-office';

export class DesignOfficeDataSource implements DataSource<DesignOffice> {
    private designOfficesSubject = new BehaviorSubject<DesignOffice[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public designOffices$ = this.designOfficesSubject.asObservable();

    constructor(private designOfficeService: DesignOfficeService, private authService: AuthService) {

    }

    loadDesignOffices( ) {
                //     this.store.pipe( select(getDesignOfficesPageLoaded()),
                //     tap((designOffice) => {
                //         this.designOfficesSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (designOffice.filteredDesignOffices.length > 0 ) {
                //             if (designOffice.allSearches[0]) {
                //                 this.paginationSubject.next(designOffice.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.designOfficesSubject.next(designOffice.filteredDesignOffices);
                //         } else if (designOffice.allSearches[0].pageQuery.totalItems !== 0) {
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshDesignOfficePageAuthRequest(
                //               designOffice.allSearches[0] &&
                //               designOffice.allSearches[0].searchBox ? 'filter=' + designOffice.allSearches[0].searchBox : 'filter=',
                //               designOffice.allSearches[0] &&
                //               designOffice.allSearches[0].categories &&
                //               designOffice.allSearches[0].categories[0] ?
                //               designOffice.allSearches[0].categories.map(x => x.id.toString()) : ['-1'],
                //               designOffice.allSearches[0] &&
                //               designOffice.allSearches[0].designers &&
                //               designOffice.allSearches[0].designers[0] ?
                //               designOffice.allSearches[0].designers.map(x => x.officeId.toString()) : ['empty'],
                //               designOffice.allSearches[0].pageQuery,
                //               this.authService.getDecodedToken().nameid));
                //           } else {
                //               this.store.dispatch(new RefreshDesignOfficePageRequest(
                //                 designOffice.allSearches[0] &&
                //                 designOffice.allSearches[0].searchBox ? 'filter=' + designOffice.allSearches[0].searchBox : 'filter=',
                //                 designOffice.allSearches[0] &&
                //                 designOffice.allSearches[0].categories &&
                //                 designOffice.allSearches[0].categories[0] ?
                //                 designOffice.allSearches[0].categories.map(x => x.id.toString()) : ['-1'],
                //                 designOffice.allSearches[0] &&
                //                 designOffice.allSearches[0].designers &&
                //                 designOffice.allSearches[0].designers[0] ?
                //                 designOffice.allSearches[0].designers.map(x => x.officeId.toString()) : ['empty'],
                //                 designOffice.allSearches[0].pageQuery));
                //           }
                //       }
                      
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<DesignOffice[]> {
   
        return this.designOfficesSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.designOfficesSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
