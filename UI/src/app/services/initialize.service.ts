import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { PageImages } from '../models/page-images';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class InitializeService {
  baseUrl = environment.apiUrl;
constructor(private http: HttpClient, private authService: AuthService) { }
getPageImages(pageNumber: number): Observable<PageImages[]> {
  return this.http.get<PageImages[]>(this.baseUrl + 'publicpage/GetPageImagesPublic/' + pageNumber);
}
getPageImagesAuth(userId: number, pageNumber: number): Observable<PageImages[]> {
  return this.http.get<PageImages[]>(this.baseUrl + `users/${userId}/page/GetPageImages/${pageNumber}`);
}
}
