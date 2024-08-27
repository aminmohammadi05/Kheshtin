import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BrandCategory } from '../models/brand-category';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BrandCategoryService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
    private authService= inject(AuthService);
  constructor() { }
  addBrandCategory(category: any, brandId: string): Observable<BrandCategory> {
    return this.http.post<BrandCategory>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/categories/CreateCategory/' + brandId, category);
  }
  getBrandCategories(brandId: string, term = 'filter=', pageNumber = 0, pageSize = 3): Observable<PaginatedResult<BrandCategory[]>> {
    const paginatedResult: PaginatedResult<BrandCategory[]> = new PaginatedResult<BrandCategory[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<BrandCategory[]>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid
     + '/brandcategories/GetBrandCategories/' + term + '/' + brandId , { observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }
  getSelectedCategories(selectedBrand: string): Observable<BrandCategory[]> {
    return this.http.get<BrandCategory[]>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid
     + '/brandcategories/GetAllBrandCategories/' + selectedBrand );
  }
  getProductsOfCategory(id: string, brandId: string, term = 'filter=', pageNumber = 0, pageSize = 3): Observable<PaginatedResult<Product[]>> {
    const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<Product[]>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid
     + '/brandcategories/GetProductsOfCategory/' + term + '/' + id + '/' + brandId
      , { observe: 'response', params}).pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }
  getProductsOfCategorySearch(term: string) {
    return this.http.get<Product[]>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid
     + '/brandcategories/GetProductsOfCategorySearch/' + term +
     '/' + this.authService.getDecodedToken().groupsid + '/1/10');
  }
  removeCategory(id: string) {
    return this.http.delete(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid
     + '/brandcategories/DeleteCategory/' + id);
  }
  updateCategory(category: any) {
    return this.http.put(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid
     + '/brandcategories/UpdateCategory/' + this.authService.getDecodedToken().groupsid, category);
  }
  }
