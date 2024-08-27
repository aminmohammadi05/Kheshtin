import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BrandCatalog } from '../models/brand-catalog';
import { Observable } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { Product } from '../models/product';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandCatalogService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
    private authService= inject(AuthService);
  constructor() { }


  getAllBrandCatalogs(brandId: string): Observable<BrandCatalog[]> {
    return this.http.get<BrandCatalog[]>(this.baseUrl + 'publicbrandcatalogs/GetAllBrandCatalogsPublic/' + brandId);
  }

  getAllBrandCatalogsAuth(userId: any, brandId: string): Observable<BrandCatalog[]> {
    return this.http.get<BrandCatalog[]>(this.baseUrl + `users/${userId}/brandcatalogs/GetBrandCatalogs/${brandId}`);
  }

  getBrandCatalogs(filter: string, brandId: string, pageNumber = 0,
    pageSize = 3): Observable<PaginatedResult<BrandCatalog[]>> {
    const paginatedResult: PaginatedResult<BrandCatalog[]> = new PaginatedResult<BrandCatalog[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<BrandCatalog[]>(this.baseUrl + 'publicbrandcatalogs/GetPublicBrandCatalogs/' + filter + '/' + brandId,
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

  getBrandCatalogsAuth(filter: string, userId: any, brandId: string, pageNumber = 0,
    pageSize = 3): Observable<PaginatedResult<BrandCatalog[]>> {
      const paginatedResult: PaginatedResult<BrandCatalog[]> = new PaginatedResult<BrandCatalog[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<BrandCatalog[]>(this.baseUrl + `users/${userId}/brandcatalogs/GetBrandCatalogs/${filter}/${brandId}`, { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getProductsOfCatalog(id: { toString: () => string; }, term = 'filter=', pageNumber = 0, pageSize = 3): Observable<PaginatedResult<Product[]>> {
    const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<Product[]>(this.baseUrl + '/publicbrandcatalogs/GetProductsOfCatalogPublic/' + term + '/' + id.toString()
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
