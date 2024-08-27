import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, combineLatest } from 'rxjs';
import { Project } from '../models/project';
import { PaginatedResult } from '../models/pagination';
import { map, pluck } from 'rxjs/operators';
import { ProjectCategory } from '../models/project-category';
import { Province } from '../models/province';
import { City } from '../models/city';
import { ProjectComment } from '../models/project-comment';
import { AppSettings } from '../app.settings';
import { ProjectAdminReply } from '../models/project-admin-reply';
import { User } from '../models/user';
import { GET_PROJECTS_BY_CONDITION} from '../queries/get-projects-by-condition';
import { GET_ALL_PROJECTS } from '../queries/get-all-projects';
import { Apollo } from 'apollo-angular';
import { ProjectSearch } from '../models/project-search';
import { DesignOfficeProjectSearch } from '../models/design-office-project-search';
import { GET_DESIGNOFFICE_PROJECTS } from '../queries/get-design-office-projects';
import { environment } from '../../environments/environment';
import { ProjectCategorySet } from '../models/project-category-set';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private apollo= inject(Apollo);
    public appSettings= inject(AppSettings);
    private authService= inject(AuthService);
  constructor() { }
  addProject(project: any): Observable<Project> {
    return this.http.post<Project>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/projects/CreateProject',  project);
  }
  updateProject(project: Project): Observable<Project> {

    return this.http.put<Project>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/projects/UpdateProject/' + project.projectId,  project);
  }

  getProjects(searchFields: DesignOfficeProjectSearch, searchText: string[]): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/searchProjects?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.searchBox ? searchFields.searchBox.replace('null', '') : ''}  ${searchFields.categories ? searchFields.categories.map(x => 'ProjectCategory-'+x.id).join(' ') : ''} ${searchFields.designerId ? searchFields.designerId : ''} '}`),
    this.apollo.query({
      query: GET_PROJECTS_BY_CONDITION,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
  ])
   
  }

  getDesignOfficeProjects(searchFields: DesignOfficeProjectSearch, searchText: any): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/getDesignOfficeProjects?parameters=' + `{from: 0, size: '${searchFields.pageQuery.itemsPerPage}', designoffice: '${searchFields.designerId}', fulltext: '${searchFields.searchBox ? searchFields.searchBox.replace('null', '') : ''}  ${searchFields.categories ? searchFields.categories.map(x => 'ProjectCategory-'+x.id).join(' ') : ''}  '}`),
    this.apollo.query({
      query: GET_DESIGNOFFICE_PROJECTS,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
  ])
   
  }
  
  getAllProjects(first: number, skip: number): Observable<any> {
    return this.apollo.query({
      query: GET_ALL_PROJECTS,
      variables: { first : first, skip: skip}
    }).pipe(pluck("data"))
  }

  removeUserProject(projectId: string, userId: string): Observable<string> {
    return this.http.delete<string>(this.baseUrl + 'users/' + userId +
     '/projects/DeleteProject/' +  projectId);
  }

  

  getDesignerProjects(designerId = -1): Observable<Project[]> {
    return this.http.get<Project[]>(this.baseUrl  + 'users/' + designerId
     + '/projects/GetMyProjects/' + designerId );
  }

  getProvinces(): Observable<Province[]> {
    return this.http.get<Province[]>(this.baseUrl + 'publicprojects/GetAllProvincesPublic/');
  }

  getProvincesAuth(userId: any): Observable<Province[]> {
    return this.http.get<Province[]>(this.baseUrl + `users/${userId}/projects/GetAllProvinces/`);
  }

  getDesigners(): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + 'publicprojects/GetAllDesignersPublic/');
  }
  getDesignersAuth(userId: number): Observable<User[]> {
    return this.http.get<User[]>(this.baseUrl + `users/${userId}/projects/GetAllDesignersAuth/`);
  }
  getProject(projectId: string): Observable<Project> {
    return this.http.get<Project>(this.baseUrl + 'publicprojects/GetProjectPublic/' + projectId);
  }

  getProjectAuth(projectId: string, userId: number): Observable<Project> {
    return this.http.get<Project>(this.baseUrl + `users/${userId}/projects/GetProject/` + projectId);
  }

  getProjectsAuth(term = 'filter=', designers: string[]= [], categories: string[]= [],
                  pageNumber = 0, pageSize = 3,
                  userId: number): Observable<PaginatedResult<Project[]>> {
const paginatedResult: PaginatedResult<Project[]> = new PaginatedResult<Project[]>();
let params = new HttpParams();
params = params.append('pageNumber', pageNumber.toString());
params = params.append('pageSize', pageSize.toString());
return this.http.get<Project[]>(this.baseUrl + `users/${userId}/projects/GetProjectsFilter/`
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

getRelatedProjects(categories: number[]= []): Observable<Project[]> {
  return this.http.get<Project[]>(this.baseUrl + 'publicprojects/GetRelatedProjectsPublic/' + categories.map(x => x.toString()).join('_'));
}
getRelatedProjectsAuth(categories: number[]= [], userId: number): Observable<Project[]> {
  return this.http.get<Project[]>(this.baseUrl + `users/${userId}/projects/GetRelatedProjects/` +
    categories.map(x => x.toString()).join('_'));
}

  getProjectComments(projectId: string): Observable<ProjectComment[]> {
    return this.http.get<ProjectComment[]>(this.baseUrl + 'projects/GetProjectComments/' + projectId);
  }

  getProjectAdminReplies(projectId: string): Observable<ProjectAdminReply[]> {
    return this.http.get<ProjectAdminReply[]>(this.baseUrl + 'projects/GetProjectAdminReplies/' + projectId);
  }

  getCitiesOfProvince(province: string): Observable<City[]> {
    return this.http.get<City[]>(this.baseUrl + 'publicprojects/GetCitiesOfProvincePublic/' + province);
  }
  getCitiesOfProvinceAuth(province: string, userId: any): Observable<City[]> {
    return this.http.get<City[]>(this.baseUrl + `users/${userId}/projects/GetCitiesOfProvince/` + province);
  }


  getProjectCategories(): Observable<ProjectCategory[]> {
    return this.http.get<ProjectCategory[]>(this.baseUrl + 'publicprojects/GetProjectCategories/');
  }
  getProjectCategoriesAuth(userId: number): Observable<ProjectCategory[]> {
    return this.http.get<ProjectCategory[]>(this.baseUrl + `users/${userId}/projects/GetProjectCategoriesAuth/`);
  }
  sendComment(comment: any): Observable<ProjectComment> {
    return this.http.post<ProjectComment>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/projects/CreateComment',  comment);
  }

  filterData(data: Project[], params: any, sort?: any, page?: any, perPage?: any) {
    if (params) {
      if (params.searchBox) {
        data = data.filter(x => x.name.includes(params.searchBox.substring(7, params.searchBox.length - 1)));
      }

      if (params.designersBox && params.designersBox[0] !== 'empty') {
        const designers: any[] = [];
        params.designersBox.forEach((designer: { name: any; }) => { designers.push(designer.name); });
        const projects: any[] = [];
        designers.forEach(designer => {
          projects.concat(data.filter(project => project.createUserId === designer));
        });
        data = projects;
      }

      if (params.categoriesBox && params.categoriesBox[0] !== '-1') {
        const categories: ProjectCategorySet[] = [];
        params.categoriesBox.forEach((category: { name: any; }) => { categories.push(category.name); });
        const projects: Project[] = [];
        data.filter(project =>
          project.projectCategorySetList.forEach(f => {
            if (categories.indexOf(f) > -1) {
              if (!projects.includes(project)) {
                projects.push(project);
              }
            }
          }));
        data = projects;
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
          if (this.appSettings.settings.currency === 'USD') {
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
          if (this.appSettings.settings.currency === 'EUR') {
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
          if (this.appSettings.settings.currency === 'USD') {
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
          if (this.appSettings.settings.currency === 'EUR') {
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
