
import {CollectionViewer, DataSource} from '@angular/cdk/collections';
import {Observable, BehaviorSubject, of} from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { User } from '../models/user';
import { AuthService } from './auth.service';
import { UserService } from './user.service';
import { PaginatedResult } from '../models/pagination';

export class UserDataSource implements DataSource<User> {

    private usersSubject = new BehaviorSubject<User[]>([]);
    private paginationSubject = new BehaviorSubject<number>(0);
    private loadingSubject = new BehaviorSubject<boolean>(false);

    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();

    constructor(private userService: UserService) {

    }

    loadUsers(pageIndex: number,
                pageSize: number) {

        this.loadingSubject.next(true);

        // this.userService.getShopUsers(pageIndex, pageSize).pipe(
        //         catchError(() => of([])),
        //         finalize(() => this.loadingSubject.next(false))
        //     )
        //     .subscribe((users: PaginatedResult<User[]>) => {
        //         if (users) {
        //             this.usersSubject.next(users.result);
        //             this.paginationSubject.next(users.pagination.totalItems);
        //         }
        //     });

    }

    connect(collectionViewer: CollectionViewer): Observable<User[]> {
        
        return this.usersSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.usersSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
