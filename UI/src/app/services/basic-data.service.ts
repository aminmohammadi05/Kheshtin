import { Injectable } from '@angular/core';
import { Brand } from '../models/brand';
import { Category } from '../models/category';
import { Product } from '../models/product';
import { environment } from 'src/environments/environment.prod';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { MENU_LIST} from '../queries/menu'
import { HOME_CAROUSEL} from '../queries/home-carousel'
import { CATEGORIES_QUICK_ACCESS} from '../queries/categories-quick-access'
import { CATEGORIES} from '../queries/categories'
import { PROJECT_CATEGORIES} from '../queries/project-categories'
import { BRANDS_SEARCH} from '../queries/brands'
import { GET_BRAND_COLLECTION_BY_BRAND_ID } from '../queries/get-brand-collection-by-brand-id'
import {pluck} from "rxjs/operators"
import { Observable } from 'rxjs';
import { EVENT_CATEGORIES } from '../queries/get-event-categories';
import { GET_ALL_DESIGN_OFFICES_FOR_DROPDOWN } from '../queries/get-all-design-offices-for-drop-down';
import { HOME_SERVICES } from '../queries/home-services';

@Injectable({
  providedIn: 'root'
})
export class BasicDataService {
  public allManufacturers: Brand[];
  public allCategories: Category[];
  public latestProducts: Product[];
  baseUrl = environment.apiUrl;
constructor(private apollo: Apollo) { }
encode(data) {
  return encodeURIComponent(JSON.stringify(data));
}
decode(searchString) {
  return JSON.parse(decodeURIComponent(searchString));
}
getMenuList(): Observable<any>{
  return this.apollo.query({
    query: MENU_LIST
  }).pipe(pluck("data"))
}


getHomeCarouselList(): Observable<any>{
  return this.apollo.query({
    query: HOME_CAROUSEL
  }).pipe(pluck("data"))
}
getHomeServices(): Observable<any>{
  return this.apollo.query({
    query: HOME_SERVICES
  }).pipe(pluck("data"))
}

getCategoriesQuickAccess(): Observable<any>{
  return this.apollo.query({
    query: CATEGORIES_QUICK_ACCESS
  }).pipe(pluck("data"))
}

getCategories(): Observable<any>{
  return this.apollo.query({
    query: CATEGORIES
  }).pipe(pluck("data"))
}

getProjectCategories(): Observable<any>{
  return this.apollo.query({
    query: PROJECT_CATEGORIES
  }).pipe(pluck("data"))
}
getDesignOffices(): Observable<any>{
  return this.apollo.query({
    query: GET_ALL_DESIGN_OFFICES_FOR_DROPDOWN
  }).pipe(pluck("data"))
}

getEventCategories(): Observable<any>{
  return this.apollo.query({
    query: EVENT_CATEGORIES
  }).pipe(pluck("data"))
}

getBrands(): Observable<any>{
  return this.apollo.query({
    query: BRANDS_SEARCH
  }).pipe(pluck("data"))
}

getBrandCollectionByBrandId(searchText): Observable<any>{
  return this.apollo.query({
    query: GET_BRAND_COLLECTION_BY_BRAND_ID,
    variables: { searchText: searchText }
  }).pipe(pluck("data"))
}
}
