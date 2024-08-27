import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Usage } from "../models/usage";
import { AuthService } from "./auth.service";
import { environment } from "../../environments/environment";

@Injectable({
    providedIn: 'root'
  })
  export class UsageService {
    baseUrl = environment.apiUrl;
    private http = inject(HttpClient);
  private authService= inject(AuthService);
  constructor() { }
              
    getUsages(): Observable<Usage[]> {
    return this.http.get<Usage[]>(this.baseUrl + 'publicproducts/GetAllUsagesPublic');
    }
    getUsagesAuth(): Observable<Usage[]> {
        return this.http.get<Usage[]>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid + '/products/GetAllUsages');
        }

}