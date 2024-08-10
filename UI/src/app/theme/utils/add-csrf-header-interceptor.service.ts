import { Injectable } from '@angular/core';
import { HttpRequest, HttpInterceptor, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable} from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AddCsrfHeaderInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      const requestToken = this.getCookieValue('XSRF-TOKEN');
      return next.handle(req.clone({
          headers: req.headers.set('X-XSRF-TOKEN', requestToken)
      }));
  }

  private getCookieValue(cookieName: string) {
      const allCookies = decodeURIComponent(document.cookie).split('; ');
      for (let i = 0; i < allCookies.length; i++) {
          const cookie = allCookies[i];
          if (cookie.startsWith(cookieName + '=')) {
              return cookie.substring(cookieName.length + 1);
          }
      }
      return '';
  }
}

