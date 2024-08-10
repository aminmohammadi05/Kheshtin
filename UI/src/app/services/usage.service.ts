import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Usage } from "../models/usage";
import { AuthService } from "./auth.service";

@Injectable({
    providedIn: 'root'
  })
  export class UsageService {
    baseUrl = environment.apiUrl;
  constructor(private http: HttpClient,
              private authService: AuthService) { }
              
    getUsages(): Observable<Usage[]> {
    return this.http.get<Usage[]>(this.baseUrl + 'publicproducts/GetAllUsagesPublic');
    }
    getUsagesAuth(): Observable<Usage[]> {
        return this.http.get<Usage[]>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid + '/products/GetAllUsages');
        }

}