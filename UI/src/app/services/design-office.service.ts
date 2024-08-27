import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from './auth.service';
import { PaginatedResult } from '../models/pagination';
import { map, pluck } from 'rxjs/operators';
import { Statistics } from '../models/statistics';
import { DesignOffice } from '../models/design-office';
import { DesignOfficeSearch } from '../models/design-office-search';
import { Apollo } from 'apollo-angular';
import { GET_DESIGN_OFFICES_BY_CONDITION} from '../queries/get-design-offices-by-condition';
import { GET_ALL_DESIGN_OFFICES } from '../queries/get-all-design-offices';
import { GET_DESIGN_OFFICE_BY_ID } from '../queries/get-design-office-by-id';
import { OneOfficeVideoSearch } from '../models/one-office-video-search';
import { GET_VIDEOS_BY_OFFICE_ID } from '../queries/get-videos-by-office-id';
import { environment } from '../../environments/environment';



@Injectable({
  providedIn: 'root'
})
export class DesignOfficeService {
  
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private apollo= inject(Apollo);
    private authService= inject(AuthService);
  constructor() { }
  


  getAllDesignOfficesAuth(userId: any): Observable<DesignOffice[]> {
    return this.http.get<DesignOffice[]>(this.baseUrl + `users/${userId}/designOffices/GetAllDesignOffices/`);
  }

  getDesignOffices(searchFields: DesignOfficeSearch, searchText: any): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/searchDesignOffices?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.searchBox ? searchFields.searchBox.replace('null', '') : ''}  ${searchFields.categories ? searchFields.categories.map(x => 'ProjectType-'+x.id).join(' ') : ''} ${searchFields.hashtagObject ? searchFields.hashtagObject.searchField.replace("#", "") : ''}'}`),
    this.apollo.query({
      query: GET_DESIGN_OFFICES_BY_CONDITION,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))

]);
    // return this.apollo.query({
    //   query: GET_DESIGN_OFFICES_BY_CONDITION,
    //   variables: { searchText : searchText}
    // }).pipe(pluck("data"))
  }

  getVideosByOfficeId(searchFields: OneOfficeVideoSearch, searchText: string) {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/getVideoByOfficeId?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.designerId}'}`),
    this.apollo.query({
      query: GET_VIDEOS_BY_OFFICE_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data")) ]);
  }
  
  getAllDesignOffices(first: number, skip: number): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/designOfficeCount'),
        this.apollo.query({
          query: GET_ALL_DESIGN_OFFICES,
          variables: { first : first, skip: skip}
        }).pipe(pluck("data"))
    
    ]);
    
  }

  getDesignOfficesAuth(term = 'filter=', categories: string[]= [],
                       pageNumber = 0, pageSize = 3, userId: any): Observable<PaginatedResult<DesignOffice[]>> {
   const paginatedResult: PaginatedResult<DesignOffice[]> = new PaginatedResult<DesignOffice[]>();
   let params = new HttpParams();
   params = params.append('pageNumber', pageNumber.toString());
   params = params.append('pageSize', pageSize.toString());
   return this.http.get<DesignOffice[]>(this.baseUrl
    + `users/${userId}/designOffices/GetDesignOfficesFilter/` + term + '/' +
     categories.join('_') , { observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
    }));
}
  getDesignOfficeById(designOfficeId: any): Observable<any> {
    return this.apollo.query({
      query: GET_DESIGN_OFFICE_BY_ID,
      variables: { contentItemId : designOfficeId}
    }).pipe(pluck("data"));
  }
  getDesignOfficeTotalProjects(officeName: any): Observable<any> {
    return this.http.get<any>(this.baseUrl +
       `queries/GetDesignOfficeProjectsCount?parameters={"from": 0, "size": 1,"fulltext" :  "${officeName}"}`);
  }

  getDesignOfficeByIdAuth(designOfficeId: string, userId: any): Observable<DesignOffice> {
    return this.http.get<DesignOffice>(this.baseUrl + `users/${userId}/designOffices/GetDesignOfficeByDisplayId/` + designOfficeId);
  }

  getDesignOfficeCategories(designOfficeId: string): Observable<DesignOffice> {
    return this.http.get<DesignOffice>(this.baseUrl + 'publicdesignOffices/GetDesignOfficeCategoriesPublic/' + designOfficeId);
  }

  incrementVisitors(): Observable<Statistics> {
   
    return this.http.get<Statistics>(this.baseUrl + 'publicdesignOffices/IncrementVisit');
  }

  getCsrfToken(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'antiforgery/GenerateAntiForgeryTokens');
  }

}
