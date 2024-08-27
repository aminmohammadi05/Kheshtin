import { inject, Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, combineLatest, forkJoin } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { map, mergeMap, pluck } from 'rxjs/operators';
import { Province } from '../models/province';
import { City } from '../models/city';
import { AppSettings, Settings } from '../app.settings';
import { User } from '../models/user';
import { OfficeProject } from '../models/office-project';
import { OfficeProjectCategory } from '../models/office-project-category';
import { DesignOfficeProject } from '../models/design-office-project';
import { GET_OFFICE_PROJECTS_BY_CONDITION} from '../queries/get-office-projects-by-condition';
import { GET_ALL_OFFICE_PROJECTS } from '../queries/get-all-office-projects';
import { Apollo } from 'apollo-angular';
import { OfficeProjectSearch } from '../models/office-project-search';
import { GET_LATEST_OFFICE_PROJECTS_HOME } from '../queries/get-latest-office-projects-home';
import { GET_PROJECTS_BY_CATEGORY_PRODUCT_DETAIL } from '../queries/get-projects-by-category-product-detail';
import { GET_OFFICE_PROJECT_BY_ID } from '../queries/get-office-project-by-id';
import { OfficeProjectCategorySet } from '../models/office-project-category-set';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OfficeProjectService {
 
  baseUrl = environment.apiUrl;
  private settings!: Settings;
  private http = inject(HttpClient);
  private apollo= inject(Apollo);
    public appSettings= inject(AppSettings);
    private authService= inject(AuthService);
  constructor() {
    this.settings = this.appSettings.createNew();
   }
  addOfficeProject(officeProject: any): Observable<OfficeProject> {
    return this.http.post<OfficeProject>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/officeProjects/CreateOfficeProject',  officeProject);
  }
  updateOfficeProject(officeProject: OfficeProject): Observable<OfficeProject> {

    return this.http.put<OfficeProject>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/officeProjects/UpdateOfficeProject/' + officeProject.projectId,  officeProject);
  }

  removeUserOfficeProject(officeProjectId: string, userId: string): Observable<string> {
    return this.http.delete<string>(this.baseUrl + 'users/' + userId +
     '/officeProjects/DeleteOfficeProject/' +  officeProjectId);
  }

  
  getOfficeProjects(searchFields: OfficeProjectSearch, searchText: any): Observable<any> {
   
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/searchProjects?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.searchBox ? searchFields.searchBox.replace('null', '') : ''}  ${searchFields.categories ? searchFields.categories.map(x => 'ProjectType-'+x.id).join(' ') : ''} ${searchFields.designers ? searchFields.designers.map(x => x.id).join(' ') : ''} ${searchFields.hashtagObject ? searchFields.hashtagObject.searchField.replace("#", "") : ''}'}`),
    this.apollo.query({
      query: GET_OFFICE_PROJECTS_BY_CONDITION,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))

]);

    
    
  }
  
  getAllOfficeProjects(first: number, skip: number):  Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/projectsCount'),
        this.apollo.query({
          query: GET_ALL_OFFICE_PROJECTS,
          variables: { first : first, skip: skip}
        }).pipe(pluck("data"))
    
    ]);
  }

  getLatestOfficeProjectsHome(searchText: string):  Observable<any> {
    return this.apollo.query({
      query: GET_LATEST_OFFICE_PROJECTS_HOME,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
  }
  getOfficeProjectById(projectId: any):  Observable<any> {
    return this.apollo.query({
      query: GET_OFFICE_PROJECT_BY_ID,
      variables: { contentItemId : projectId}
    }).pipe(pluck("data"))
  }


  getDesignOfficeProjects(term = 'filter=', designers: string, categories: string[]= [],
                          pageNumber = 0, pageSize = 3): Observable<PaginatedResult<DesignOfficeProject[]>> {
    const paginatedResult: PaginatedResult<DesignOfficeProject[]> = new PaginatedResult<DesignOfficeProject[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<DesignOfficeProject[]>(this.baseUrl + 'publicofficeproject/GetOfficeProjectsFilterPublic/'
    + term + '/' + designers + '/' + categories.join('_') , { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getOfficeProjectByBrandId(brandId = 'empty',
                            pageNumber = 0, pageSize = 3): Observable<PaginatedResult<OfficeProject[]>> {
      const paginatedResult: PaginatedResult<OfficeProject[]> = new PaginatedResult<OfficeProject[]>();
      let params = new HttpParams();
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      return this.http.get<OfficeProject[]>(this.baseUrl + 'publicofficeproject/GetOfficeProjectsByBrandIdPublic/'
      + brandId , { observe: 'response', params})
      .pipe(
      map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
      paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
      }));
}
getRelatedOfficeProjectByProductId(productId: string): Observable<OfficeProject[]> {
return this.http.get<OfficeProject[]>(this.baseUrl + 'publicofficeproject/GetOfficeProjectsByProductIdPublic/'+ productId );
}
getRelatedOfficeProjectByProductIdAuth(userId: any, productId: string): Observable<OfficeProject[]> {
  return this.http.get<OfficeProject[]>(this.baseUrl + `users/${userId}/officeprojects/GetOfficeProjectsByProductId/`+ productId );
  }

getOfficeProjectByBrandIdAuth(userId: any, brandId = 'empty',
                              pageNumber = 0, pageSize = 3): Observable<PaginatedResult<OfficeProject[]>> {
      const paginatedResult: PaginatedResult<OfficeProject[]> = new PaginatedResult<OfficeProject[]>();
      let params = new HttpParams();
      params = params.append('pageNumber', pageNumber.toString());
      params = params.append('pageSize', pageSize.toString());
      return this.http.get<OfficeProject[]>(this.baseUrl + `users/${userId}/officeprojects/GetOfficeProjectsByBrandId/${brandId}`
      , { observe: 'response', params})
      .pipe(
      map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
      paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
      }));
}

  getOneOfficeProjects(term = 'filter=', designer: string= 'empty', categories: string[]= [],
                       pageNumber = 0, pageSize = 3): Observable<PaginatedResult<OfficeProject[]>> {
    const paginatedResult: PaginatedResult<OfficeProject[]> = new PaginatedResult<OfficeProject[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<OfficeProject[]>(this.baseUrl + 'publicofficeproject/GetOneOfficeProjectsFilterPublic/'
    + term + '/' + designer + '/' + categories.join('_') , { observe: 'response', params})
    .pipe(
      map(response => {
        paginatedResult.result = response.body!;
        if (response.headers.get('Pagination') != null) {
          paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
        }
        return paginatedResult;
      }));
  }

  getDesignerOfficeProjects(designerId = -1): Observable<OfficeProject[]> {
    return this.http.get<OfficeProject[]>(this.baseUrl  + 'users/' + designerId
     + '/officeProjects/GetMyOfficeProjects/' + designerId );
  }

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(this.baseUrl + 'publicofficeproject/GetAllProvincesPublic/');
  }

  getProvincesAuth(userId: any): Observable<Province[]> {
    return this.http.get<Province[]>(this.baseUrl + `users/${userId}/officeprojects/GetAllProvinces/`);
  }

  getDesigners(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'publicofficeproject/GetAllDesignersPublic/');
  }
  getDesignersAuth(userId: number): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + `users/${userId}/officeprojects/GetAllDesignersAuth/`);
  }
  getOfficeProject(officeProjectId: string): Observable<OfficeProject> {
    return this.http.get<OfficeProject>(this.baseUrl + 'publicofficeproject/GetOfficeProjectPublic/' + officeProjectId);
  }

  getOfficeProjectAuth(officeProjectId: string, userId: number): Observable<OfficeProject> {
    return this.http.get<OfficeProject>(this.baseUrl + `users/${userId}/officeprojects/GetOfficeProjectByDisplayId/` + officeProjectId);
  }

  getOfficeProjectsAuth(term = 'filter=', designers: string[]= [], categories: string[]= [],
                        pageNumber = 0, pageSize = 3,
                        userId: number): Observable<PaginatedResult<OfficeProject[]>> {
const paginatedResult: PaginatedResult<OfficeProject[]> = new PaginatedResult<OfficeProject[]>();
let params = new HttpParams();
params = params.append('pageNumber', pageNumber.toString());
params = params.append('pageSize', pageSize.toString());
return this.http.get<OfficeProject[]>(this.baseUrl + `users/${userId}/officeprojects/GetOfficeProjectsFilter/`
+ term + '/' + designers.join('_') + '/' + categories.join('_') , { observe: 'response', params})
.pipe(
map(response => {
paginatedResult.result = response.body!;
if (response.headers.get('Pagination') != null) {
paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
}
return paginatedResult;
}));
}

getDesignOfficeProjectsAuth(term = 'filter=', designers: string, categories: string[]= [],
                            pageNumber = 0, pageSize = 3,
                            userId: number): Observable<PaginatedResult<DesignOfficeProject[]>> {
const paginatedResult: PaginatedResult<DesignOfficeProject[]> = new PaginatedResult<DesignOfficeProject[]>();
let params = new HttpParams();
params = params.append('pageNumber', pageNumber.toString());
params = params.append('pageSize', pageSize.toString());
return this.http.get<DesignOfficeProject[]>(this.baseUrl + `users/${userId}/officeprojects/GetOfficeProjectsFilter/`
+ term + '/' + designers + '/' + categories.join('_') , { observe: 'response', params})
.pipe(
map(response => {
paginatedResult.result = response.body!;
if (response.headers.get('Pagination') != null) {
paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
}
return paginatedResult;
}));
}


getRecentOfficeProjects(): Observable<OfficeProject[]> {
  return this.http.get<OfficeProject[]>(this.baseUrl + 'publicofficeproject/GetRecentOfficeProjects/');
}
getRecentOfficeProjectsAuth(userId: number): Observable<OfficeProject[]> {
  return this.http.get<OfficeProject[]>(this.baseUrl + `users/${userId}/officeprojects/GetRecentOfficeProjectsAuth/`);
}
getRelatedOfficeProjects(searchText: string): Observable<any> {
  return this.apollo.query({
    query: GET_PROJECTS_BY_CATEGORY_PRODUCT_DETAIL,
    variables: { searchText : searchText}
  }).pipe(pluck("data"))
}
getRelatedOfficeProjectsAuth(categories: number[]= [], userId: number): Observable<OfficeProject[]> {
  return this.http.get<OfficeProject[]>(this.baseUrl + `users/${userId}/officeprojects/GetRelatedOfficeProjects/` +
    categories.map(x => x.toString()).join('_'));
}


  getCitiesOfProvince(province: string): Observable<City[]> {
    return this.http.get<City[]>(this.baseUrl + 'publicofficeproject/GetCitiesOfProvincePublic/' + province);
  }
  getCitiesOfProvinceAuth(province: string, userId: any): Observable<City[]> {
    return this.http.get<City[]>(this.baseUrl + `users/${userId}/officeprojects/GetCitiesOfProvince/` + province);
  }


  getOfficeProjectCategories(): Observable<OfficeProjectCategory[]> {
    return this.http.get<OfficeProjectCategory[]>(this.baseUrl + 'publicofficeprojectcategories/GetOfficeProjectCategoriesPublic/');
  }
  getOfficeProjectCategoriesAuth(userId: number): Observable<OfficeProjectCategory[]> {
    return this.http.get<OfficeProjectCategory[]>(this.baseUrl + `users/${userId}/officeprojectcategories/GetOfficeProjectCategories/`);
  }

  filterData(data: OfficeProject[], params: any, sort?: any, page?: any, perPage?: any) {
    if (params) {
      if (params.searchBox) {
        data = data.filter(x => x.name.includes(params.searchBox.substring(7, params.searchBox.length - 1)));
      }

      if (params.designersBox && params.designersBox[0] !== 'empty') {
        const designers: any[] = [];
        params.designersBox.forEach((designer: { name: any; }) => { designers.push(designer.name); });
        const officeProjects: any[] = [];
        designers.forEach(designer => {
          officeProjects.concat(data.filter(officeProject => officeProject.createUserId === designer));
        });
        data = officeProjects;
      }

      if (params.categoriesBox && params.categoriesBox[0] !== '-1') {
        const categories: OfficeProjectCategorySet[] = [];
        params.categoriesBox.forEach((category: { name: any; }) => { categories.push(category.name); });
        const officeProjects: OfficeProject[] = [];
        data.filter(officeProject =>
          officeProject.officeProjectCategorySetList.forEach(f => {
            if (categories.indexOf(f) > -1) {
              if (!officeProjects.includes(officeProject)) {
                officeProjects.push(officeProject);
              }
            }
          }));
        data = officeProjects;
      }
    }
    this.sortData(sort, data);
    return data;
  }

  public sortData(sort: any, data: any[]) {
    if (sort) {
      switch (sort) {
        case 'Newest':
          data = data.sort((a: { published: string | number | Date; }, b: { published: string | number | Date; }) => <any>new Date(b.published) - <any>new Date(a.published));
          break;
        case 'Oldest':
          data = data.sort((a: { published: string | number | Date; }, b: { published: string | number | Date; }) => <any>new Date(a.published) - <any>new Date(b.published));
          break;
        case 'Popular':
          data = data.sort((a: { ratingsValue: number; ratingsCount: number; }, b: { ratingsValue: number; ratingsCount: number; }) => {
            if (a.ratingsValue / a.ratingsCount < b.ratingsValue / b.ratingsCount) {
              return 1;
            }
            if (a.ratingsValue / a.ratingsCount > b.ratingsValue / b.ratingsCount) {
              return -1;
            }
            return 0;
          });
          break;
        case 'Price (Low to High)':
          if (this.settings.currency === 'USD') {
            data = data.sort((a: { priceDollar: { sale: any; rent: any; }; }, b: { priceDollar: { sale: any; rent: any; }; }) => {
              if ((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)) {
                return 1;
              }
              if ((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)) {
                return -1;
              }
              return 0;
            });
          }
          if (this.settings.currency === 'EUR') {
            data = data.sort((a: { priceEuro: { sale: any; rent: any; }; }, b: { priceEuro: { sale: any; rent: any; }; v: { rent: any; }; }) => {
              if ((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.v.rent)) {
                return 1;
              }
              if ((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.priceEuro.rent)) {
                return -1;
              }
              return 0;
            });
          }
          break;
        case 'Price (High to Low)':
          if (this.settings.currency === 'USD') {
            data = data.sort((a: { priceDollar: { sale: any; rent: any; }; }, b: { priceDollar: { sale: any; rent: any; }; }) => {
              if ((a.priceDollar.sale || a.priceDollar.rent) < (b.priceDollar.sale || b.priceDollar.rent)) {
                return 1;
              }
              if ((a.priceDollar.sale || a.priceDollar.rent) > (b.priceDollar.sale || b.priceDollar.rent)) {
                return -1;
              }
              return 0;
            });
          }
          if (this.settings.currency === 'EUR') {
            data = data.sort((a: { priceEuro: { sale: any; rent: any; }; }, b: { priceEuro: { sale: any; rent: any; }; v: { rent: any; }; }) => {
              if ((a.priceEuro.sale || a.priceEuro.rent) < (b.priceEuro.sale || b.v.rent)) {
                return 1;
              }
              if ((a.priceEuro.sale || a.priceEuro.rent) > (b.priceEuro.sale || b.priceEuro.rent)) {
                return -1;
              }
              return 0;
            });
          }
          break;
        default:
          break;
      }
    }
    return data;
  }
}
function combineLates(arg0: Observable<unknown>): Observable<any> {
  throw new Error('Function not implemented.');
}

