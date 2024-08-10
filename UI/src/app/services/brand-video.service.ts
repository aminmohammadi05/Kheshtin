import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BrandVideo } from '../models/brand-video';
import { Observable, combineLatest } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { Product } from '../models/product';
import { map, pluck } from 'rxjs/operators';
import { Apollo } from 'apollo-angular';
import { GET_ALL_BRAND_VIDEOS } from '../queries/get-all-brand-videos';
import { BrandVideoSearch } from '../models/brand-video-search';

@Injectable({
  providedIn: 'root'
})
export class BrandVideoService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService,private apollo: Apollo) { }


  getAllBrandVideos(searchFields: BrandVideoSearch, searchText): Observable<any[]> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/getVideoByBrandId?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.brandId}'}`),
        this.apollo.query({
          query: GET_ALL_BRAND_VIDEOS,
          variables: { searchText : searchText}
        }).pipe(pluck("data"))
    
    ]);
  }

  getAllBrandVideosAuth(userId, brandId: string): Observable<BrandVideo[]> {
    return this.http.get<BrandVideo[]>(this.baseUrl + `users/${userId}/brandvideos/GetBrandVideos/${brandId}`);
  }

  getBrandVideos(filter: string, brandId: string, pageNumber = 0,
    pageSize = 3): Observable<PaginatedResult<BrandVideo[]>> {
    const paginatedResult: PaginatedResult<BrandVideo[]> = new PaginatedResult<BrandVideo[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<BrandVideo[]>(this.baseUrl + 'publicbrandvideos/GetPublicBrandVideos/' + filter + '/' + brandId,
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

  getBrandVideosAuth(filter: string, userId, brandId: string, pageNumber = 0,
    pageSize = 3):  Observable<PaginatedResult<BrandVideo[]>>  {
      const paginatedResult: PaginatedResult<BrandVideo[]> = new PaginatedResult<BrandVideo[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<BrandVideo[]>(this.baseUrl + `users/${userId}/brandvideos/GetBrandVideos/${filter}/${brandId}`,
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

  getProductsOfVideo(id, term = 'filter=', pageNumber = 0, pageSize = 3): Observable<PaginatedResult<Product[]>> {
    const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<Product[]>(this.baseUrl + '/publicbrandvideos/GetProductsOfVideoPublic/' + term + '/' + id.toString()
      , { observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        }
        return paginatedResult;
      }));
  }
}
