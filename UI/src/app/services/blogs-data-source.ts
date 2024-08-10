
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
import { Blog } from '../models/blog';
import { BlogService } from './blog.service';

export class BlogsDataSource implements DataSource<Blog> {
    private blogsSubject = new BehaviorSubject<Blog[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(true);
    private paginationSubject = new BehaviorSubject<Pagination>(null);
    public loading$ = this.loadingSubject.asObservable();
    public pagination$ = this.paginationSubject.asObservable();
    public blogs$ = this.blogsSubject.asObservable();

    constructor(private blogService: BlogService, private authService: AuthService) {

    }

    loadBlogs( ) {
                //     this.store.pipe( select(getBlogsPageLoaded()),
                //     tap((blog) => {
                //         this.blogsSubject.next([]);
                //         this.paginationSubject.next(new Pagination(0, 12, 0, null));
                //         if (blog.filteredBlogs.length > 0 ) {
                //             if (blog.allSearches[0]) {
                //                 this.paginationSubject.next(blog.allSearches[0].pageQuery);
                //             }
                //             this.loadingSubject.next(false);
                //             this.blogsSubject.next(blog.filteredBlogs);
                //         } else if (blog.allSearches[0].pageQuery.totalItems !== 0) { 
                //               if (this.authService.loggedIn()) {
                //               this.store.dispatch(new RefreshBlogPageAuthRequest(
                //               blog.allSearches[0] &&
                //               blog.allSearches[0].searchBox ? 'filter=' + blog.allSearches[0].searchBox : 'filter=',
                //               blog.allSearches[0] &&
                //               blog.allSearches[0].categoriesBoxNested &&
                //               blog.allSearches[0].categoriesBoxNested[0] ?
                //               blog.allSearches[0].categoriesBoxNested : [],
                //               blog.allSearches[0].pageQuery,
                //               this.authService.getDecodedToken().nameid));
                //           } else {
                //               this.store.dispatch(new RefreshBlogPageRequest(
                //               blog.allSearches[0] &&
                //               blog.allSearches[0].searchBox ? 'filter=' + blog.allSearches[0].searchBox : 'filter=',
                //               blog.allSearches[0] &&
                //               blog.allSearches[0].categoriesBoxNested &&
                //               blog.allSearches[0].categoriesBoxNested[0] ?
                //               blog.allSearches[0].categoriesBoxNested : [],
                //               blog.allSearches[0].pageQuery));
                //           }
                //       }
                      
                // }),
                // catchError(() => of([]))).subscribe();

}

    connect(collectionViewer: CollectionViewer): Observable<Blog[]> {
  
        return this.blogsSubject.asObservable();
    }

    disconnect(collectionViewer: CollectionViewer): void {
        this.blogsSubject.complete();
        this.loadingSubject.complete();
        this.paginationSubject.complete();
    }

}
