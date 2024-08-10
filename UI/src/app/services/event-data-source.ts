
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
import { Event } from '../models/event';
import { EventService } from './event.service';

export class EventDataSource implements DataSource<Event> {
    private eventsSubject = new BehaviorSubject<Event[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public events$ = this.eventsSubject.asObservable();

    constructor(private eventService: EventService,  private authService: AuthService) {

    }

    loadEvents( ) {
                //     this.store.pipe( select(getEventsPageLoaded()),
                //     tap((event) => {
                //         this.eventsSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (event.filteredEvents.length > 0 ) {
                //             if (event.allSearches[0]) {
                //                 this.paginationSubject.next(event.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.eventsSubject.next(event.filteredEvents);
                //         } else if (event.allSearches[0].pageQuery.totalItems !== 0){
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshEventPageAuthRequest(
                //                 event.allSearches[0] &&
                //                 event.allSearches[0].searchBox ? 'filter=' + event.allSearches[0].searchBox : 'filter=',                                
                //                 event.allSearches[0] &&
                //                 event.allSearches[0].categories &&
                //                 event.allSearches[0].categories.length > 0 ? event.allSearches[0].categories : [],
                //                 event.allSearches[0].pageQuery,
                //               this.authService.getDecodedToken().nameid));
                //           } else {
                //               this.store.dispatch(new RefreshEventPageRequest(
                //                 event.allSearches[0] &&
                //                 event.allSearches[0].searchBox ? 'filter=' + event.allSearches[0].searchBox : 'filter=',
                //                 event.allSearches[0] &&
                //                 event.allSearches[0].categories &&
                //                 event.allSearches[0].categories.length > 0 ? event.allSearches[0].categories : [],
                //                 event.allSearches[0].pageQuery));
                //           }
                //       }
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<Event[]> {
   
        return this.eventsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.eventsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
