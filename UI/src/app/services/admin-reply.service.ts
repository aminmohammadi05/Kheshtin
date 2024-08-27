import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { ProjectAdminReply } from '../models/project-admin-reply';
import { HttpParams, HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminReplyService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);
constructor() { }
getAdminReplies(term = 'filter=', pageNumber = 0, pageSize = 3): Observable<PaginatedResult<ProjectAdminReply[]>> {
    const paginatedResult: PaginatedResult<ProjectAdminReply[]> = new PaginatedResult<ProjectAdminReply[]>();
      let params = new HttpParams();
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
    return this.http.get<ProjectAdminReply[]>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/projects/GetAdminReplies/' +
     this.authService.getDecodedToken().nameid + '/'
    + term , { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  markAdminMessageAsRead(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/projects/MarkAdminReplyAsRead');
  }

  markProjectCommentAsRead(projectId: string): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/projects/MarkProjectCommentAsRead/' + projectId);
  }

}
