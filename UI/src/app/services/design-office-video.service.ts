import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { DesignOfficeVideo } from '../models/design-office-video';

@Injectable({
  providedIn: 'root'
})
export class DesignOfficeVideoService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService) { }


  getAllDesignOfficeVideos(designOfficeId: string): Observable<DesignOfficeVideo[]> {
    return this.http.get<DesignOfficeVideo[]>(this.baseUrl + 'publicdesignOfficevideos/GetAllDesignOfficeVideosPublic/' + designOfficeId);
  }

  getAllDesignOfficeVideosAuth(userId, designOfficeId: string): Observable<DesignOfficeVideo[]> {
    return this.http.get<DesignOfficeVideo[]>(this.baseUrl + `users/${userId}/designOfficevideos/GetDesignOfficeVideos/${designOfficeId}`);
  }

  getDesignOfficeVideos(filter: string, designOfficeId: string, pageNumber = 0,
    pageSize = 3): Observable<PaginatedResult<DesignOfficeVideo[]>> {
      const paginatedResult: PaginatedResult<DesignOfficeVideo[]> = new PaginatedResult<DesignOfficeVideo[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<DesignOfficeVideo[]>(this.baseUrl + 'publicdesignOfficevideos/GetPublicDesignOfficeVideos/' + filter + '/' + designOfficeId,
    { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }));
  }

  getDesignOfficeVideosAuth(filter: string, userId, designOfficeId: string, pageNumber = 0,
    pageSize = 3): Observable<PaginatedResult<DesignOfficeVideo[]>> {
      const paginatedResult: PaginatedResult<DesignOfficeVideo[]> = new PaginatedResult<DesignOfficeVideo[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<DesignOfficeVideo[]>(this.baseUrl + `users/${userId}/designOfficevideos/GetDesignOfficeVideos/${filter}/${designOfficeId}`,
    { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }));
  }

  
}
