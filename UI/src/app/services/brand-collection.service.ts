import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BrandCollection } from '../models/brand-collection';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandCollectionService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
    private authService= inject(AuthService);
  constructor() { }


  getAllBrandCollections(brandId: string): Observable<BrandCollection[]> {
    return this.http.get<BrandCollection[]>(this.baseUrl + 'publicbrandcollections/GetAllBrandCollectionsPublic/' + brandId);
  }

  getAllBrandCollectionsAuth(userId: any, brandId: string): Observable<BrandCollection[]> {
    return this.http.get<BrandCollection[]>(this.baseUrl + `users/${userId}/brandcollections/GetBrandCollections/${brandId}`);
  }

  getBrandCollections(filter: string, brandId: string, pageNumber = 0,
    pageSize = 3): Observable<PaginatedResult<BrandCollection[]>> {
    const paginatedResult: PaginatedResult<BrandCollection[]> = new PaginatedResult<BrandCollection[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<BrandCollection[]>(this.baseUrl + 'publicbrandcollections/GetPublicBrandCollections/' + filter + '/' + brandId, { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getBrandCollectionsAuth(filter: string, userId: any, brandId: string, pageNumber = 0,
    pageSize = 3): Observable<PaginatedResult<BrandCollection[]>> {
    const paginatedResult: PaginatedResult<BrandCollection[]> = new PaginatedResult<BrandCollection[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<BrandCollection[]>(this.baseUrl + `users/${userId}/brandcollections/GetBrandCollections/${filter}/${brandId}`, { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getProductsOfCollection(id: { toString: () => string; }, term = 'filter=', pageNumber = 0, pageSize = 3): Observable<PaginatedResult<Product[]>> {
    const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<Product[]>(this.baseUrl + '/publicbrandcollections/GetProductsOfCollectionPublic/' + term + '/' + id.toString()
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
