
import { DataSource } from '@angular/cdk/table';
import { BehaviorSubject, of, Observable } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, finalize, tap, withLatestFrom } from 'rxjs/operators';
import { PaginatedResult, Pagination } from '../models/pagination';
import { CategoryService } from './category.service';
import { Category } from '../models/category';
import { PaginationComponent } from 'ngx-bootstrap/pagination/public_api';
import { AuthService } from './auth.service';
import { debounce } from 'lodash';
import { UserMoodBoard } from '../models/user-moodboard';
import { MoodBoardService } from './mood-board.service';
import { CollectionViewer } from '@angular/cdk/collections';

export class MyMoodBoardDataSource implements DataSource<UserMoodBoard> {
    private moodBoardsSubject = new BehaviorSubject<UserMoodBoard[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public moodBoards$ = this.moodBoardsSubject.asObservable();

    constructor(private moodBoardService: MoodBoardService,  private authService: AuthService) {

    }

    loadMoodBoards( ) {
                //     this.store.pipe( select(getMyMoodBoardsPageLoaded()),
                //     tap((moodBoard) => {
                //         this.moodBoardsSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (moodBoard.filteredMoodBoards.length > 0 ) {
                //             if (moodBoard.allSearches[0]) {
                //                 this.paginationSubject.next(moodBoard.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.moodBoardsSubject.next(moodBoard.filteredMoodBoards);
                //         } else if (moodBoard.allSearches[0].pageQuery.totalItems !== 0) {
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshUserMoodBoardsPageAuthRequest(
                //                 moodBoard.allSearches[0].pageQuery,
                //                 this.authService.getDecodedToken().nameid));
                //           }
                //       }
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<UserMoodBoard[]> {
    
        return this.moodBoardsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.moodBoardsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
