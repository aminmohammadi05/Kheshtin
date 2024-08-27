import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { ProfessionalArea } from '../models/professional-area';
import { UserFavorites } from '../models/user-favorites';
import { UserMoodBoardCandidateProduct } from '../models/user-mood-board-candidate-product';
import { environment } from '../../environments/environment';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private authService = inject(AuthService);
constructor() { }

  getLoggedInUserInfo(userId: any): Observable<User> {
    return this.http.get<User>(this.baseUrl + `users/${userId}/users/GetUser/${userId}`);
  }

  getProfessioanlAreas(): Observable<ProfessionalArea[]> {
    return this.http.get<ProfessionalArea[]>(this.baseUrl + 'publicusers/GetProfessionalAreaPublic');
  }
signupRegularUser(user: User): Observable<User> {

  return this.http.post<User>(this.baseUrl + 'publicusers/PublicCreateUser',  user);
}
likeProduct(userId: number, productId: string): Observable<UserFavorites> {
  return this.http.post<UserFavorites>(this.baseUrl + `users/${userId}/products/LikeProduct/${true}`,
    new UserFavorites(userId, productId, new User(), new Product()));
}
addProductToMoodBoardCandidates(userId: number, productId: string): Observable<PaginatedResult<UserMoodBoardCandidateProduct[]>> {
  const paginatedResult: PaginatedResult<UserMoodBoardCandidateProduct[]> =
                                        new PaginatedResult<UserMoodBoardCandidateProduct[]>();
  let params = new HttpParams();
  params = params.append('pageNumber', '0');
  params = params.append('pageSize', '12');
  return this.http.post<UserMoodBoardCandidateProduct[]>(this.baseUrl + `users/${userId}/products/AddProductToMoodBoardCandidates/`,
    new UserMoodBoardCandidateProduct({
      productId: productId,
      createUserId: userId
    }),
    { headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response', params})
 .pipe(
   map(response => {
     paginatedResult.result = response.body!;
     if (response.headers.get('Pagination') != null) {
       paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
     }
     return paginatedResult;
   }));
}
removeProductFromMoodBoardCandidates(userId: number, productId: string): Observable<PaginatedResult<UserMoodBoardCandidateProduct[]>> {
  const paginatedResult: PaginatedResult<UserMoodBoardCandidateProduct[]> =
                                        new PaginatedResult<UserMoodBoardCandidateProduct[]>();
  let params = new HttpParams();
  params = params.append('pageNumber', '0');
  params = params.append('pageSize', '12');
  return this.http.get<UserMoodBoardCandidateProduct[]>(this.baseUrl + `users/${userId}/products/RemoveProductFromMoodBoardCandidates/${productId}`,
  { headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response', params})
.pipe(
 map(response => {
   paginatedResult.result = response.body!;
   if (response.headers.get('Pagination') != null) {
     paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
   }
   return paginatedResult;
 }));
}
emptyMoodBoardCandidates(userId: number): Observable<boolean> {
  return this.http.get<boolean>(this.baseUrl + `users/${userId}/products/RemoveAllProductsFromMoodBoardCandidates`);
}
getUserMoodBoardCandidateProducts(term = 'filter=',
                                  brands: string[] = [],
                                  categories: string[]= [],
                                  colors: string[]= [],
                                  materials: string[]= [],
                                  pageNumber = 0, pageSize = 3, userId: any): Observable<PaginatedResult<UserMoodBoardCandidateProduct[]>> {
                                    const paginatedResult: PaginatedResult<UserMoodBoardCandidateProduct[]> =
                                        new PaginatedResult<UserMoodBoardCandidateProduct[]>();
                                    let params = new HttpParams();
                                    params = params.append('pageNumber', (pageNumber).toString());
                                    params = params.append('pageSize', pageSize.toString());
                                    return this.http.get<UserMoodBoardCandidateProduct[]>(this.baseUrl
                      + `users/${userId}/products/GetMoodBoardCandidateProductsFilter/` + term + '/' + brands.join('_') +  '/' + materials.join('_') + '/' +
                       categories.join('_') + '/' + colors.join('_') ,
                       { headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response', params})
                    .pipe(
                      map(response => {
                        paginatedResult.result = response.body!;
                        if (response.headers.get('Pagination') != null) {
                          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
                        }
                        return paginatedResult;
                      }));
}
removeLikeProduct(userId: number, productId: string): Observable<string> {
  return this.http.post<string>(this.baseUrl + `users/${userId}/products/RemoveLikeProduct/${false}`,
    new UserFavorites(userId, productId, new User(), new Product()));
}
updateUser(user: any): Observable<User> {
  return this.http.post<User>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid
   + '/users/UpdateUser',  user);
}

getUserFavorites(userId: any): Observable<UserFavorites[]> {
  return this.http.get<UserFavorites[]>(this.baseUrl + `users/${userId}/products/GetUserFavorites`);
}
}
