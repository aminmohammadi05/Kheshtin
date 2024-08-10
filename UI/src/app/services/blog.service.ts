import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment.prod';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, combineLatest } from 'rxjs';
import { Blog } from '../models/blog';
import { PaginatedResult } from '../models/pagination';
import { map, pluck } from 'rxjs/operators';
import { Statistics } from '../models/statistics';
import { HomeBlog } from '../models/home-blog';
import { Apollo } from 'apollo-angular';
import { Search } from '../models/search';
import { GET_BLOGS_BY_CONDITION} from '../queries/get-blogs-by-condition';
import { GET_ALL_BLOGS } from '../queries/get-all-blogs';
import { BlogSearch } from '../models/blog-search';
import { GET_LATEST_BLOGS_HOME } from '../queries/get-latest-blogs-home';
import { GET_BLOG_BY_ID } from '../queries/get-blog-by-id';
import { GET_RELATED_BLOGS } from '../queries/get-related-blogs';
import { BasicDataService } from './basic-data.service';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient,
    private apollo: Apollo,
    public basicService: BasicDataService,
    private authService: AuthService) { }
  

  getAllBlogsAuth(userId): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.baseUrl + `users/${userId}/blogposts/GetAllBlogs/`);
  }

  getBlogs(searchFields: BlogSearch, searchText): Observable<any> {
   
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/searchBlogs?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.searchBox ? searchFields.searchBox.replace('null', '') : ''}  ${searchFields.categoriesBox ? searchFields.categoriesBox.map(x => 'ProjectType-'+x.categoryId).join(' ') : ''} ${searchFields.hashtagObject ? searchFields.hashtagObject.searchField.replace("#", "") : ''}'}`),
    this.apollo.query({
      query: GET_BLOGS_BY_CONDITION,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
  ]);
    // return this.apollo.query({
    //   query: GET_BLOGS_BY_CONDITION,
    //   variables: { searchText : searchText}
    // }).pipe(pluck("data"))
  }
  
  getAllBlogs(first: number, skip: number): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/blogsCount'),
        this.apollo.query({
          query: GET_ALL_BLOGS,
          variables: { first : first, skip: skip}
        }).pipe(pluck("data"))
    
    ]);
   
  }

  getLatestBlogsHome(searchText): Observable<any> {
    return this.apollo.query({
      query: GET_LATEST_BLOGS_HOME,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
   
  }

  getBlogsAuth(term = 'filter=', categories: string[]= [],
               pageNumber = 0, pageSize = 3, userId): Observable<PaginatedResult<Blog[]>> {
   const paginatedResult: PaginatedResult<Blog[]> = new PaginatedResult<Blog[]>();
   let params = new HttpParams();
   params = params.append('pageNumber', pageNumber.toString());
   params = params.append('pageSize', pageSize.toString());
   return this.http.get<Blog[]>(this.baseUrl
    + `users/${userId}/blogposts/GetBlogPosts/` + term + '/' +
     categories.join('_') , { observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    }));
}
  getBlogById(blogId): Observable<any> {
    return this.apollo.query({
      query: GET_BLOG_BY_ID,
      variables: { contentItemId : blogId}
    }).pipe(pluck("data"))
  }

  getBlogByIdAuth(blogId, userId): Observable<Blog> {
    return this.http.get<Blog>(this.baseUrl + `users/${userId}/blogposts/GetBlogByDisplayId/` + blogId);
  }

  getBlogCategories(blogId): Observable<Blog> {
    return this.http.get<Blog>(this.baseUrl + 'publicblogposts/GetBlogCategoriesPublic/' + blogId);
  }

  incrementVisitors(): Observable<Statistics> {

    return this.http.get<Statistics>(this.baseUrl + 'publicblogposts/IncrementVisit');
  }

  public getFeaturedBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.baseUrl + 'publicblogposts/GetFeaturedBlogsPublic/');
  }


  public getRelatedBlogs(searchText): Observable<any> {
    return this.apollo.query({
      query: GET_RELATED_BLOGS,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
  }
  public getRelatedBlogsAuth(categories: number[]= [], userId: number): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.baseUrl + `users/${userId}/blogposts/GetRelatedBlogs/` +
      categories.map(x => x.toString()).join('_'));
  }

  getRecentBlogs() : Observable<HomeBlog[]>{
    return this.http.get<HomeBlog[]>
      (this.baseUrl + 'publicblogposts/GetRecentBlogsPublic/' );
  }
  getRecentBlogsAuth(userId: number): Observable<HomeBlog[]> {
    return this.http.get<HomeBlog[]>(this.baseUrl + `users/${userId}/blogposts/GetRecentBlogsAuth/` );
  }
}
