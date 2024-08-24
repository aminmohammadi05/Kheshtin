import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';

import { Observable, combineLatest, of } from 'rxjs';
import { Product} from '../models/product';
import { JwtHelperService } from '@auth0/angular-jwt';
// import { AuthService } from './auth.service';
import { PaginatedResult, Pagination } from '../models/pagination';
import { catchError, map } from 'rxjs/operators';
import { AppSettings } from '../app.settings';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductFile } from '../models/product-file';
import { DesignMoodBoardProduct } from '../models/design-mood-board-product';
import { ShowRoomProduct } from '../models/show-room-product';
import { BrandProduct } from '../models/brand-product';
import { Apollo } from 'apollo-angular';
import {pluck} from "rxjs/operators"
import { GET_PRODUCTS_BY_CONDITION} from '../queries/get-products-by-condition';
import { GET_ALL_PRODUCTS } from '../queries/get-all-products';
import { Search } from '../models/search';
import { GET_PRODUCTS_BY_CATEGORY_HOME } from '../queries/get-products-by-category-home';
import { GET_LATEST_PRODUCTS_HOME } from '../queries/get-latest-products-home';
import { GET_PRODUCT_BY_ID } from '../queries/get-product-by-id';
import { GET_PRODUCTS_BY_CATEGORY_PRODUCT_DETAIL } from '../queries/get-products-by-category-product-detail';
import { BrandProductSearch } from '../models/brand-product-search';
import { environment } from '../../environments/environment';
import { ComponentType } from '@angular/cdk/portal';

export class Data {
  constructor(public products: Product[],
              public compareList: Product[],
              public favorites: Product[]) { }
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  public Data = new Data(
    [], // products
    [], // compareList
    [], // favorites
  );
  baseUrl = environment.apiUrl;
  hostUrl = environment.hostUrl;
constructor(private http: HttpClient,
            private apollo: Apollo,
            // private authService: AuthService,
            private bottomSheet: MatBottomSheet,
            private snackBar: MatSnackBar,
            public appSettings: AppSettings) { }

getBrandProductsByCategoryAuth(brand: string, category: number, userId: string) {
  return this.http.get<Product[]>(this.baseUrl + 'users/' + userId +
   '/products/GetBrandProductsByCategoryAuth/' + brand + '/' + category);
}
getProducts1(term = 'filter=',
            brands: string[] = [],
            brandCollections: string[] = [],
            categories: string[]= [],
            fileTypes: string[]= [],
            imageUploaded = 'empty',
            pageNumber = 0, pageSize = 3): Observable<PaginatedResult<Product[]>> {

              const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
              let params = new HttpParams();
              params = params.append('pageNumber', (pageNumber).toString());
              params = params.append('pageSize', pageSize.toString());
              return this.http.post<Product[]>(this.baseUrl
    + 'publicproducts/GetPublicProducts/' + term + '/' + brands.join('_') + '/' + brandCollections.join('_') + '/' +
     categories.join('_') + '/' + fileTypes.join('_'), JSON.stringify(imageUploaded) ,
     { headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
    }));
}

getProducts(searchFields: Search, searchText: string): Observable<any> {
  return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/searchProducts?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.searchBox ? searchFields.searchBox.replace('null', '') : ''}  ${searchFields.categoriesBox ? searchFields.categoriesBox.map(x => 'ProductCategory-'+x.categoryId).join(' ') : ''} ${searchFields.brandsBox ? searchFields.brandsBox.map(x => x.name).join(' ') : ''} ${searchFields.brandCollectionBox ? searchFields.brandCollectionBox.map(x => x.brandCollectionId).join(' ') : ''}'}`),
    this.apollo.query({
      query: GET_PRODUCTS_BY_CONDITION,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
  ])
  // return this.apollo.query({
  //   query: GET_PRODUCTS_BY_CONDITION,
  //   variables: { searchText : searchText}
  // }).pipe(pluck("data"))
}

getLatestProductsHome(searchText: any): Observable<any>{
  return this.apollo.query({
    query: GET_LATEST_PRODUCTS_HOME,
    variables: { searchText : searchText}
  }).pipe(pluck("data"))
}
getProductsOfSelectedCategoryHome(searchText: any): Observable<any>{
  return this.apollo.query({
    query: GET_PRODUCTS_BY_CATEGORY_HOME,
    variables: { searchText : searchText}
  }).pipe(pluck("data"))
}
public getRelatedProducts(searchText: any): Observable<any> {
  return this.apollo.query({
    query: GET_PRODUCTS_BY_CATEGORY_PRODUCT_DETAIL,
    variables: { searchText : searchText}
  }).pipe(pluck("data"))
}

getAllProducts(first: number, skip: number): Observable<any> {
  return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/productsCount'),
        this.apollo.query({
          query: GET_ALL_PRODUCTS,
          variables: { first : first, skip: skip}
        }).pipe(pluck("data"))
    
    ]);
  
}
getAllBrandProducts(searchFields: BrandProductSearch, searchText: any): Observable<any[]> {
  return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/searchProducts?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.searchBox ? searchFields.searchBox.replace('null', '') : ''}  ${searchFields.categoriesBox ? searchFields.categoriesBox.map(x => 'ProductCategory-'+x.categoryId).join(' ') : ''} ${searchFields.brandsBox ? searchFields.brandsBox.map(x => x.brandId).join(' ') : ''} ${searchFields.brandCollectionBox ? searchFields.brandCollectionBox.map(x => x.brandCollectionId).join(' ') : ''}'}`),
    this.apollo.query({
      query: GET_PRODUCTS_BY_CONDITION,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))
  ])
  
}
getBrandProductsPaginated(term = 'filter=',
            brands: string[] = [],
            brandCollections: string[] = [],
            categories: string[]= [],
            fileTypes: string[]= [],
            imageUploaded = 'empty',
            pageNumber = 0, pageSize = 3): Observable<PaginatedResult<BrandProduct[]>> {

              const paginatedResult: PaginatedResult<BrandProduct[]> = new PaginatedResult<BrandProduct[]>();
              let params = new HttpParams();
              params = params.append('pageNumber', (pageNumber).toString());
              params = params.append('pageSize', pageSize.toString());
              return this.http.post<BrandProduct[]>(this.baseUrl
    + 'publicproducts/GetPublicProducts/' + term + '/' + brands.join('_') + '/' + brandCollections.join('_') + '/' +
     categories.join('_') + '/' + fileTypes.join('_'), JSON.stringify(imageUploaded) ,
     { headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
    }));
}
productFileImageExists(productFile: ProductFile): Observable<boolean> {
  const folderPath = `../../assets/products/small/${ productFile.productId }_${productFile.fileType}_-1_${productFile.productFileId }_0.jpg`;
  return this.http
    .get(`${folderPath}`, { observe: 'response', responseType: 'blob' })
    .pipe(
      map(response => {
        return true;
      }),
      catchError(error => {
        return of(false);
      })
    );
}

productFileRarDownload(productFile: ProductFile, fileType: number) {
  const folderPath = `../../assets/products/big/${ productFile.productId }_${fileType}_${(productFile.parentProductFileId ? productFile.parentProductFileId : '-1')}_${productFile.productFileId }_0.rar`;
  return this.http
    .get(`${folderPath}`, { observe: 'response', responseType: 'blob' })
    .pipe(
      map(response => {
        const fileName = productFile.name + '_' + (fileType === 5 ? '3dobject' : fileType === 6 ? 'revit' : fileType === 4 ? '3dmax' : fileType === 13 ? 'autocad' : fileType === 2 ? 'vray' : fileType === 3 ? 'texture' : '') + '.rar';
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(response.body!);
        link.download = fileName;
        link.click();
      })
    ).subscribe();
}
getMoodBoardProducts(term = 'filter=',
                     brands: string[] = [],
                     categories: string[]= [],
                     colors: string[]= [],
                     materials: string[]= [],
                     pageNumber = 0, pageSize = 3): Observable<PaginatedResult<Product[]>> {

              const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
              let params = new HttpParams();
              params = params.append('pageNumber', (pageNumber).toString());
              params = params.append('pageSize', pageSize.toString());
              return this.http.get<Product[]>(this.baseUrl
    + 'publicproducts/GetPublicMoodBoardProducts/' + term + '/' + brands.join('_') + '/' + materials.join('_') + '/' +
     categories.join('_') + '/' + colors.join('_') ,
     { headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
    }));
}
getBrandProducts(brandId: string): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + 'publicproducts/GetBrandProductsPublic/' + brandId);
}
getBrandTextureProducts(brandId: string): Observable<ShowRoomProduct[]> {
  return this.http.get<ShowRoomProduct[]>(this.baseUrl + 'publicproducts/GetBrandTextureProductsPublic/' + brandId);
}

getProductById(productId: any): Observable<any> {
  return this.apollo.query({
    query: GET_PRODUCT_BY_ID,
    variables: { contentItemId : productId}
  }).pipe(pluck("data"))
}
getRecentProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + 'publicproducts/GetRecentProductsPublic/');
}
getProductsById(productIdList: string[]): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + 'publicproducts/GetProductsByIdListPublic/' + productIdList.join('_'));
}
getProductsByIdAuth(productIdList: string[], userId: any): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + `users/${userId}/products/GetProductsByIdList/` + productIdList.join('_'));
}

getProductsAuth(term = 'filter=',
                brands: string[] = [],
                brandCollections: string[] = [],
                categories: string[]= [],
                fileTypes: string[]= [],
                imageUploaded = '',
                pageNumber = 0, pageSize = 3, userId: any): Observable<PaginatedResult<Product[]>> {

                  const paginatedResult: PaginatedResult<Product[]> = new PaginatedResult<Product[]>();
                  let params = new HttpParams();
                  params = params.append('pageNumber', (pageNumber).toString());
                  params = params.append('pageSize', pageSize.toString());
                  return this.http.post<Product[]>(this.baseUrl
    + `users/${userId}/products/GetProductsFilter/` + term + '/' + brands.join('_') +  '/' + brandCollections.join('_') + '/' +
     categories.join('_') + '/' + fileTypes.join('_'), JSON.stringify(imageUploaded) ,
     { headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
    }));
}
getBrandProductsAuthPaginated(term = 'filter=',
                brands: string[] = [],
                brandCollections: string[] = [],
                categories: string[]= [],
                fileTypes: string[]= [],
                imageUploaded = '',
                pageNumber = 0, pageSize = 3, userId: any): Observable<PaginatedResult<BrandProduct[]>> {

                  const paginatedResult: PaginatedResult<BrandProduct[]> = new PaginatedResult<BrandProduct[]>();
                  let params = new HttpParams();
                  params = params.append('pageNumber', (pageNumber).toString());
                  params = params.append('pageSize', pageSize.toString());
                  return this.http.post<BrandProduct[]>(this.baseUrl
    + `users/${userId}/products/GetProductsFilter/` + term + '/' + brands.join('_') +  '/' + brandCollections.join('_') + '/' +
     categories.join('_') + '/' + fileTypes.join('_'), JSON.stringify(imageUploaded) ,
     { headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
    }));
}

getMoodBoardProductsAuth(term = 'filter=',
                         brands: string[] = [],
                         categories: string[]= [],
                         colors: string[]= [],
                         materials: string[]= [],
                         pageNumber = 0, pageSize = 3, userId: any): Observable<PaginatedResult<DesignMoodBoardProduct[]>> {

                  const paginatedResult: PaginatedResult<DesignMoodBoardProduct[]> = new PaginatedResult<DesignMoodBoardProduct[]>();
                  let params = new HttpParams();
                  params = params.append('pageNumber', (pageNumber).toString());
                  params = params.append('pageSize', pageSize.toString());
                  return this.http.get<DesignMoodBoardProduct[]>(this.baseUrl
    + `users/${userId}/products/GetMoodBoardProductsFilter/` + term + '/' + brands.join('_') +  '/' + materials.join('_') + '/' +
     categories.join('_') + '/' + colors.join('_') ,
     { headers: new HttpHeaders({'Content-Type': 'application/json'}), observe: 'response', params})
  .pipe(
    map(response => {
      paginatedResult.result = response.body!;
      if (response.headers.get('Pagination') != null) {
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
      }
      return paginatedResult;
    }));
}

getBrandProductsAuth(brandId: string, userId: any): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + `users/${userId}/products/GetBrandProductsAuth/` + brandId);
}
getBrandTextureProductsAuth(brandId: string, userId: any): Observable<ShowRoomProduct[]> {
  return this.http.get<ShowRoomProduct[]>(this.baseUrl + `users/${userId}/products/GetBrandTextureProductsAuth/` + brandId);
}
getProductByIdAuth(productId: string, userId: any): Observable<Product> {
  return this.http.get<Product>(this.baseUrl + `users/${userId}/products/GetProductByDisplayId/` + productId);
}
getRecentProductsAuth(userId: any): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + `users/${userId}/products/GetRecentProductsAuth/`);
}





public addToCompare(product: Product, component: ComponentType<unknown>, direction: any) {
  if (!this.Data.compareList.filter(item => item.productId === product.productId)[0]) {
    this.Data.compareList.push(product);
    this.bottomSheet.open(component, {
      direction: direction
    }).afterDismissed().subscribe(isRedirect => {
      if (isRedirect) {
        window.scrollTo(0, 0);
      }
    });
  }
}



public addToFavorites(product: Product, direction: any) {
  this.snackBar.open(product.name + '" به لیست علایق شما اضافه شد', '×', {
    verticalPosition: 'top',
    duration: 3000,
    direction: direction 
  });
}

public getFeaturedProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + 'publicproducts/GetRecentProductsPublic/');
}
public getHomeProducts(): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + 'publicproducts/GetHomeProductsPublic/');
}
public getHomeProductsAuth(userId: any): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + `users/${userId}
  /products/GetHomeProductsAuth/`);
}
public getFeaturedProductsAuth(userId: any): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + `users/${userId}
  /products/GetRecentProductsAuth/`);
}


public getRelatedProductsAuth(categories: number[]= [], userId: any): Observable<Product[]> {
  return this.http.get<Product[]>(this.baseUrl + `users/${userId}
  /products/GetRelatedProductsAuth/${categories.map(x => x.toString()).join('_')}`);
}
}
