import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { catchError, switchMap, filter, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RefreshTokenInterceptorService implements HttpInterceptor {

  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(public authService: AuthService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authService.getJwtToken()!) {
      request = this.addToken(request, this.authService.getJwtToken()!);
    }

   return new Observable<HttpEvent<any>>();
    // next.handle(request).pipe(catchError(error => {
    //   if (error instanceof HttpErrorResponse && error.status === 401) {
    //     return this.handle401Error(request, next);
    //   } else {
    //     return throwError(error);
    //   }
    // }));
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`
      }
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    // if (!this.isRefreshing) {
    //   this.isRefreshing = true;
    //   this.refreshTokenSubject.next(null);

    //   return this.authService.refreshToken().pipe(
    //     switchMap((token: any) => {
    //       this.isRefreshing = false;
    //       this.refreshTokenSubject.next(token.jwt);
    //       return next.handle(this.addToken(request, token.jwt));
    //     }));

    // } else {
    //   return this.refreshTokenSubject.pipe(
    //     filter(token => token != null),
    //     take(1),
    //     switchMap(jwt => {
    //       return next.handle(this.addToken(request, jwt));
    //     }));
    // }
  }
}
