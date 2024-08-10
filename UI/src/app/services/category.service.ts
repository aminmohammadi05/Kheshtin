import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class CategoryService {
baseUrl = environment.apiUrl;
constructor(private http: HttpClient, private authService: AuthService) { }

addCategory(categoryList: number[]): Observable<boolean> {
  return this.http.post<boolean>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
   '/categories/CreateCategory/' + this.authService.getDecodedToken().groupsid, categoryList);
}

getCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(this.baseUrl + 'publiccategories/GetPublicCategories/');
}
getFlatCategories(): Observable<Category[]> {
  return this.http.get<Category[]>(this.baseUrl + 'publiccategories/GetPublicFlatCategories/');
}

getCategoriesAuth(userId): Observable<Category[]> {
  return this.http.get<Category[]>(this.baseUrl + `users/${userId}/categories/GetCategories/`);
}

getProductsOfCategory(id, term = 'filter=', pageNumber = 0, pageSize = 3): Observable<PaginatedResult<Product[]>> {
  const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
  let params = new HttpParams();
  params = params.append('pageNumber', pageNumber.toString());
  params = params.append('pageSize', pageSize.toString());
  return this.http.get<Product[]>(this.baseUrl + '/publiccategories/GetProductsOfCategoryPublic/' + term + '/' + id.toString()
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
