import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BrandReseller } from '../models/brand-reseller';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandResellerService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
    private authService= inject(AuthService);
  constructor() { }


  getAllBrandResellers(brandId: string): Observable<BrandReseller[]> {
    return this.http.get<BrandReseller[]>(this.baseUrl + 'publicbrandresellers/GetAllBrandResellersPublic/' + brandId);
  }

  getAllBrandResellersAuth(userId: any, brandId: string): Observable<BrandReseller[]> {
    return this.http.get<BrandReseller[]>(this.baseUrl + `users/${userId}/brandresellers/GetBrandResellers/${brandId}`);
  }

  getBrandResellers(filter: string, brandId: string, pageNumber = 0,
    pageSize = 3): Observable<PaginatedResult<BrandReseller[]>> {
      const paginatedResult: PaginatedResult<BrandReseller[]> = new PaginatedResult<BrandReseller[]>();
      let params = new HttpParams();
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
    return this.http.get<BrandReseller[]>(this.baseUrl + 'publicbrandresellers/GetPublicBrandResellers/' + filter + '/' + brandId,
    { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getBrandResellersAuth(filter: string, userId: any, brandId: string, pageNumber = 0,
    pageSize = 3): Observable<PaginatedResult<BrandReseller[]>> {
      const paginatedResult: PaginatedResult<BrandReseller[]> = new PaginatedResult<BrandReseller[]>();
      let params = new HttpParams();
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
    return this.http.get<BrandReseller[]>(this.baseUrl + `users/${userId}/brandresellers/GetBrandResellers/${filter}/${brandId}`,
    { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getProductsOfReseller(id: { toString: () => string; }, term = 'filter=', pageNumber = 0, pageSize = 3): Observable<PaginatedResult<Product[]>> {
    const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<Product[]>(this.baseUrl + '/publicbrandresellers/GetProductsOfResellerPublic/' + term + '/' + id.toString()
      , { observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }
}
