import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, combineLatest } from 'rxjs';
import { AuthService } from './auth.service';
import { Brand } from '../models/brand';
import { PaginatedResult } from '../models/pagination';
import { map } from 'rxjs/operators';
import { Statistics } from '../models/statistics';
import { BrandRequest } from '../models/request';
import { Apollo } from 'apollo-angular';
import {pluck} from "rxjs/operators"
import { GET_BRANDS_BY_CONDITION} from '../queries/get-brands-by-condition';
import { GET_ALL_BRANDS } from '../queries/get-all-brands';
import { BrandSearch } from '../models/brand-search';
import { GET_BRANDS_SELECTED_FOR_HOME } from '../queries/get-brands-selected-for-home';
import { GET_BRAND_BY_ID } from '../queries/get-brand-by-id';
import { GET_SELECTED_BRAND_COLLECTIONS_BY_BRAND_ID } from '../queries/get-selected-brand-collections-by-brand-id';
import { GET_SELECTED_PRODUCTS_BY_BRAND_ID } from '../queries/get-selected-products-by-brand-id';
import { GET_SELECTED_VIDEOS_BY_BRAND_ID } from '../queries/get-selected-videos-by-brand-id';
import { GET_SELECTED_CATALOGS_BY_BRAND_ID } from '../queries/get-selected-catalogs-by-brand-id';
import { GET_SELECTED_PROJECTS_BY_BRAND_ID } from '../queries/get-selected-projects-by-brand-id';
import { GET_BRAND_COLLECTIONS_BY_BRAND_ID } from '../queries/get-brand-collections-by-brand-id';
import { BrandCollectionSearch } from '../models/brand-collection-search';
import { BrandVideoSearch } from '../models/brand-video-search';
import { GET_VIDEOS_BY_BRAND_ID } from '../queries/get-videos-by-brand-id';
import { GET_BRAND_RESELLERS_BY_BRAND_ID } from '../queries/get-brand-resellers-by-brand-id';
import { BrandCatalogSearch } from '../models/brand-catalog-search';
import { GET_BRAND_CATALOGS_BY_BRAND_ID } from '../queries/get-brand-catalogs-by-brand-id';
import { BrandOfficeProjectSearch } from '../models/brand-office-project-search';
import { GET_PROJECTS_BY_BRAND_ID } from '../queries/get-projects-by-brand-id';


@Injectable({
  providedIn: 'root'
})
export class BrandService {
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient, private authService: AuthService,
    private apollo: Apollo) { }

  getBrands(searchFields: BrandSearch, searchText): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/searchBrands?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.searchBox ? searchFields.searchBox.replace('null', '') : ''}  ${searchFields.categoriesBox ? searchFields.categoriesBox.map(x => 'ProductCategory-'+x.categoryId).join(' ') : ''}'}`),
    this.apollo.query({
      query: GET_BRANDS_BY_CONDITION,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
  ]);
    // return this.apollo.query({
    //   query: GET_BRANDS_BY_CONDITION,
    //   variables: { searchText : searchText}
    // }).pipe(pluck("data"))
  }
  
  getAllBrands(first: number, skip: number): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/brandsCount'),
        this.apollo.query({
          query: GET_ALL_BRANDS,
          variables: { first : first, skip: skip}
        }).pipe(pluck("data"))
    
    ]);
  }

  getBrandsSelectedForHome(searchText): Observable<any> {
    return this.apollo.query({
      query: GET_BRANDS_SELECTED_FOR_HOME,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
  }

 

  getAllBrandsAuth(userId): Observable<Brand[]> {
    return this.http.get<Brand[]>(this.baseUrl + `users/${userId}/brands/GetAllBrands/`);
  }

  

  getBrandsAuth(term = 'filter=', categories: string[]= [],
                pageNumber = 0, pageSize = 3, userId): Observable<PaginatedResult<Brand[]>> {
   const paginatedResult: PaginatedResult<Brand[]> = new PaginatedResult<Brand[]>();
   let params = new HttpParams();
   params = params.append('pageNumber', (pageNumber - 1).toString());
   params = params.append('pageSize', pageSize.toString());
   return this.http.get<Brand[]>(this.baseUrl
    + `users/${userId}/brands/GetBrandsFilter/` + term + '/' +
     categories.join('_') , { observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
      }
      return paginatedResult;
    }));
}
  getBrandById(brandId): Observable<any> {
    return this.apollo.query({
      query: GET_BRAND_BY_ID,
      variables: { contentItemId : brandId}
    }).pipe(pluck("data"));
  }

  getBrandTotalProducts(brandName): Observable<any> {
    return this.http.get<any>(this.baseUrl +
       `queries/GetBrandProductsCount?parameters={"from": 0, "size": 1,"fulltext" :  "${brandName}"}`);
  }
  getSelectedBrandCollectionsByBrandId(searchText): Observable<any> {
    return this.apollo.query({
      query: GET_SELECTED_BRAND_COLLECTIONS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data"));
  }
  getBrandCollectionsByBrandId(searchFields: BrandCollectionSearch, searchText): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/getBrandCollectionByBrandId?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.brandId}'}`),
    this.apollo.query({
      query: GET_BRAND_COLLECTIONS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data")) ]);
  }

  getVideosByBrandId(searchFields: BrandVideoSearch, searchText): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/getVideoByBrandId?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.brandId}'}`),
    this.apollo.query({
      query: GET_VIDEOS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data")) ]);
  }

  getBrandResellersByBrandId(searchFields: BrandCollectionSearch, searchText): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/getResellerByBrandId?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.brandId}'}`),
    this.apollo.query({
      query: GET_BRAND_RESELLERS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data")) ]);
  }

  getBrandCatalogsByBrandId(searchFields: BrandCatalogSearch, searchText): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/getBrandCatalogByBrandId?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.brandId}'}`),
    this.apollo.query({
      query: GET_BRAND_CATALOGS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data")) ]);
  }
  getProjectsByBrandId(searchFields: BrandOfficeProjectSearch, searchText): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/getProjectByBrandId?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.brandId}'}`),
    this.apollo.query({
      query: GET_PROJECTS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data")) ]);
  }

  getSelectedProductsByBrandId(searchText): Observable<any> {
    return this.apollo.query({
      query: GET_SELECTED_PRODUCTS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data"));
  }
  getSelectedVideosByBrandId(searchText): Observable<any> {
    return this.apollo.query({
      query: GET_SELECTED_VIDEOS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data"));
  }

  getSelectedCatalogsByBrandId(searchText): Observable<any> {
    return this.apollo.query({
      query: GET_SELECTED_CATALOGS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data"));
  }

  getSelectedProjectsByBrandId(searchText): Observable<any> {
    return this.apollo.query({
      query: GET_SELECTED_PROJECTS_BY_BRAND_ID,
      variables: { searchText : searchText}
    }).pipe(pluck("data"));
  }

  getBrandByIdAuth(brandId, userId): Observable<Brand> {
    return this.http.get<Brand>(this.baseUrl + `users/${userId}/brands/GetBrandByDisplayId/` + brandId);
  }

  getBrandCategories(brandId): Observable<Brand> {
    return this.http.get<Brand>(this.baseUrl + 'publicbrands/GetBrandCategoriesPublic/' + brandId);
  }

  incrementVisitors(): Observable<Statistics> {

    return this.http.get<Statistics>(this.baseUrl + 'publicbrands/IncrementVisit');
  }

  getCsrfToken(): Observable<any> {
    return this.http.get<any>(this.baseUrl + 'antiforgery/GenerateAntiForgeryTokens');
  }
  sendDataRequest(userId, request): Observable<BrandRequest> {
    return this.http.post<any>(this.baseUrl + `users/${userId}/brands/CreateBrandRequest/`, request);
  }
}
