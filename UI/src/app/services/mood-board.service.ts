import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { Statistics } from '../models/statistics';
import { UserMoodBoard } from '../models/user-moodboard';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MoodBoardService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
    private authService= inject(AuthService);
  constructor() { }
  getAllMoodBoards(): Observable<UserMoodBoard[]> {

    return this.http.get<UserMoodBoard[]>(this.baseUrl + 'publicmoodboards/GetAllMoodBoardsPublic/');
  }

  getAllMoodBoardsAuth(userId: any): Observable<UserMoodBoard[]> {
    return this.http.get<UserMoodBoard[]>(this.baseUrl + `users/${userId}/moodboards/GetAllMoodBoards/`);
  }

  getMoodBoards(term = 'filter=',
           categories: string[]= [],
           pageNumber = 0,
           pageSize = 3): Observable<PaginatedResult<UserMoodBoard[]>> {
    const paginatedResult: PaginatedResult<UserMoodBoard[]> = new PaginatedResult<UserMoodBoard[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<UserMoodBoard[]>(this.baseUrl + 'publicmoodboards/GetMoodBoardsPublic/' + term + '/' + categories.join('_')
    + '/' + true , { observe: 'response', params})
     .pipe(
       map(response => {
         paginatedResult.result = response.body!;
         if (response.headers.get('Pagination') != null) {
           paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
         }
         return paginatedResult;
       }));
  }
  createMoodBoardAuth(userId: any, moodBoard: UserMoodBoard): Observable<UserMoodBoard> {

    return this.http.post<UserMoodBoard>(this.baseUrl + `users/${userId}/moodboards/CreateMoodBoard/`, moodBoard);
  }

  getMoodBoardsAuth(term = 'filter=', categories: string[]= [],
               pageNumber = 0, pageSize = 3, userId: any): Observable<PaginatedResult<UserMoodBoard[]>> {
   const paginatedResult: PaginatedResult<UserMoodBoard[]> = new PaginatedResult<UserMoodBoard[]>();
   let params = new HttpParams();
   params = params.append('pageNumber', (pageNumber - 1).toString());
   params = params.append('pageSize', pageSize.toString());
   return this.http.get<UserMoodBoard[]>(this.baseUrl
    + `users/${userId}/moodboards/GetMoodBoards/` + term + '/' +
     categories.join('_') + '/' + true, { observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
    }));
}

getUserMoodBoardsAuth(pageNumber = 0, pageSize = 3, userId: string): Observable<PaginatedResult<UserMoodBoard[]>> {
    const paginatedResult: PaginatedResult<UserMoodBoard[]> = new PaginatedResult<UserMoodBoard[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', (pageNumber - 1).toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<UserMoodBoard[]>(this.baseUrl
                                          + `users/${userId}/moodboards/GetUserMoodBoards/` + userId , { observe: 'response', params})
                                          .pipe(map(response => {
                                                                    paginatedResult.result = response.body!;
                                                                    if (response.headers.get('Pagination') != null) {
                                                                        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
                                                                    }
                                                                    return paginatedResult;
                                                }));
  }
  getMoodBoardById(moodBoardId: string): Observable<UserMoodBoard> {
    return this.http.get<UserMoodBoard>(this.baseUrl + 'publicmoodboards/GetMoodBoardPublic/' + moodBoardId);
  }

  getMoodBoardByIdAuth(moodBoardId: string, userId: any): Observable<UserMoodBoard> {
    return this.http.get<UserMoodBoard>(this.baseUrl + `users/${userId}/moodboards/GetMoodBoardByDisplayId/` + moodBoardId);
  }

  getMoodBoardCategories(moodBoardId: string): Observable<UserMoodBoard> {
    return this.http.get<UserMoodBoard>(this.baseUrl + 'publicmoodboards/GetMoodBoardCategoriesPublic/' + moodBoardId);
  }

  incrementVisitors(): Observable<Statistics> {

    return this.http.get<Statistics>(this.baseUrl + 'publicmoodboards/IncrementVisit');
  }

  public getFeaturedMoodBoards(): Observable<UserMoodBoard[]> {
    return this.http.get<UserMoodBoard[]>(this.baseUrl + 'publicmoodboards/GetFeaturedMoodBoardsPublic/');
  }


  public getRelatedMoodBoards(categories: number[]= []): Observable<UserMoodBoard[]> {
    return this.http.get<UserMoodBoard[]>
      (this.baseUrl + 'publicmoodboards/GetRelatedMoodBoardsPublic/' + categories.map(x => x.toString()).join('_'));
  }
  public getRelatedMoodBoardsAuth(categories: number[]= [], userId: number): Observable<UserMoodBoard[]> {
    return this.http.get<UserMoodBoard[]>(this.baseUrl + `users/${userId}/moodboards/GetRelatedMoodBoards/` +
      categories.map(x => x.toString()).join('_'));
  }
}
