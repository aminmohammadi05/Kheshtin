import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import {map, tap, mapTo, catchError} from 'rxjs/operators';

import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { Tokens } from '../models/tokens';
import { Token } from '@angular/compiler';
import { Login } from '../models/login';
import { UserLogin } from '../models/user-login';
import { TokenInfo } from '../models/token-info';
import { environment } from '../../environments/environment.deployment';
// const httpOptions = {
//   headers : new HttpHeaders({
//     'Authorization' : 'Bearer ' + localStorage.getItem('JWT_TOKEN')
//   })
// };

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly JWT_TOKEN = 'JWT_TOKEN';
  private readonly REFRESH_TOKEN = 'REFRESH_TOKEN';
  private loggedUser: string = '';
  baseUrl = environment.apiUrl + 'auth/';
  jwtHelper = new JwtHelperService();
  constructor(private http: HttpClient) {

 }

 login(model: UserLogin): Observable<Login> {
  return this.http.post<Login>(this.baseUrl + 'login', model);
 }

 doLoginUser(username: string, tokens: any) {
  this.loggedUser = username;
  this.storeTokens(tokens);
}

logout() {
  // return this.http.post<any>( this.baseUrl  + 'logout/', {
  //   refreshToken: this.getRefreshToken(),
  //   userName: this.getDecodedToken().unique_name
  // }).pipe(
  //   tap(() => this.doLogoutUser()),
  //   mapTo(true),
  //   catchError(error => {
  //     return of(false);
  //   }));
}

 private doLogoutUser() {
  this.loggedUser = '';
  this.removeTokens();
}
 loggedIn() {
  return true;
  //return !!this.getJwtToken();
  }

  getRefreshToken() {
   // return localStorage.getItem(this.REFRESH_TOKEN);
  }
  getJwtToken() {
  //  return localStorage.getItem(this.JWT_TOKEN);
  }

  getDecodedToken() {
   return this.jwtHelper.decodeToken(localStorage.getItem('JWT_TOKEN')!);
  }

  refreshToken() {
    // return this.http.post<Tokens>(environment.apiUrl + 'token/refresh', {
    //   refreshToken: localStorage.getItem('REFRESH_TOKEN'),
    //   token: localStorage.getItem('JWT_TOKEN')
    // }).pipe(tap((tokens: Tokens) => {
    //   this.storeTokens(tokens);
    // }));
  }

  private storeJwtToken(jwt: string) {
   // localStorage.setItem(this.JWT_TOKEN, jwt);
  }

  private storeTokens(tokens: any) {
    // localStorage.setItem(this.JWT_TOKEN, tokens.token);
    // localStorage.setItem(this.REFRESH_TOKEN, tokens.refreshToken);
  }

  private removeTokens() {
    // localStorage.removeItem(this.JWT_TOKEN);
    // localStorage.removeItem(this.REFRESH_TOKEN);
  }
  confirmEmail(token: string, email: string): Observable<boolean> {
    const t = new TokenInfo({token: token, email: email});
    return this.http.post<boolean>(this.baseUrl + 'ConfirmEmail', t );
  }
}

