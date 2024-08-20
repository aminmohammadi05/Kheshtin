import { Injectable } from '@angular/core';

import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, combineLatest } from 'rxjs';
import { PaginatedResult } from '../models/pagination';
import { map, pluck } from 'rxjs/operators';
import { Province } from '../models/province';
import { City } from '../models/city';
import { AppSettings } from '../app.settings';
import { User } from '../models/user';
import { Event } from '../models/event';
import { EventCategory } from '../models/event-category';
import { Apollo } from 'apollo-angular';
import { EventSearch } from '../models/event-search';
import { GET_ALL_EVENTS } from '../queries/get-all-events';
import { GET_EVENTS_BY_CONDITION } from '../queries/get-events-by-condition';
import { GET_EVENT_BY_ID } from '../queries/get-event-by-id';
import { GET_LATEST_EVENTS } from '../queries/get-latest-events';
import { EventCategorySet } from '../models/event-category-set';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  baseUrl = environment.apiUrl;
  constructor(private http: HttpClient,
              private authService: AuthService,
              private apollo: Apollo,
              public appSettings: AppSettings) { }
  addEvent(event: any): Observable<Event> {
    return this.http.post<Event>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/events/CreateEvent',  event);
  }
  updateEvent(event: Event): Observable<Event> {

    return this.http.put<Event>(this.baseUrl + 'users/' + this.authService.getDecodedToken().nameid +
     '/events/UpdateEvent/' + event.eventId,  event);
  }

  removeUserEvent(eventId: string, userId: string): Observable<string> {
    return this.http.delete<string>(this.baseUrl + 'users/' + userId +
     '/events/DeleteEvent/' +  eventId);
  }

  getEvents(searchFields: EventSearch, searchText: any): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/searchEvents?parameters=' + `{from: 0, size: 1, fulltext: '${searchFields.searchBox ? searchFields.searchBox.replace('null', '') : ''}  ${searchFields.categories ? searchFields.categories.map(x => 'EventType-'+x.categoryId).join(' ') : ''} ${searchFields.hashtagObject ? searchFields.hashtagObject.searchField.replace("#", "") : ''}'}`),
    this.apollo.query({
      query: GET_EVENTS_BY_CONDITION,
      variables: { searchText : searchText}
    }).pipe(pluck("data"))

]);
  }
  getLatestEvents(first: number, skip: number): Observable<any> {
    return    this.apollo.query({
      query: GET_LATEST_EVENTS,
      variables: {first : first, skip: skip}
    }).pipe(pluck("data"));
  }
  getEventById(id: any): Observable<any> {
    return this.apollo.query({
      query: GET_EVENT_BY_ID,
      variables: { contentItemId : id}
    }).pipe(pluck("data"))
  }
  getAllEvents(first: number, skip: number): Observable<any> {
    return combineLatest([this.http.get<[]>(this.baseUrl + 'queries/eventsCount'),
        this.apollo.query({
          query: GET_ALL_EVENTS,
          variables: { first : first, skip: skip}
        }).pipe(pluck("data"))
    
    ]);
    // return this.apollo.query({
    //   query: GET_ALL_EVENTS,
    //   variables: { first : first, skip: skip}
    // }).pipe(pluck("data"))
  }


  getOneEvents(term = 'filter=', designer: string= 'empty', categories: string[]= [],
                       pageNumber = 0, pageSize = 3): Observable<PaginatedResult<Event[]>> {
    const paginatedResult: PaginatedResult<Event[]> = new PaginatedResult<Event[]>();
    let params = new HttpParams();
    params = params.append('pageNumber', pageNumber.toString());
    params = params.append('pageSize', pageSize.toString());
    return this.http.get<Event[]>(this.baseUrl + 'publicevents/GetOneEventsFilterPublic/'
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

  
  getEvent(eventId: string): Observable<Event> {
    return this.http.get<Event>(this.baseUrl + 'publicevents/GetEventPublic/' + eventId);
  }

  getEventAuth(eventId: string, userId: number): Observable<Event> {
    return this.http.get<Event>(this.baseUrl + `users/${userId}/events/GetEventByDisplayId/` + eventId);
  }

  getEventsAuth(term = 'filter=', categories: string[]= [],
                        pageNumber = 0, pageSize = 3,
                        userId: number): Observable<PaginatedResult<Event[]>> {
const paginatedResult: PaginatedResult<Event[]> = new PaginatedResult<Event[]>();
let params = new HttpParams();
params = params.append('pageNumber', pageNumber.toString());
params = params.append('pageSize', pageSize.toString());
return this.http.get<Event[]>(this.baseUrl + `users/${userId}/events/GetEvents/`
+ term + '/' + categories.join('_') , { observe: 'response', params})
.pipe(
map(response => {
paginatedResult.result = response.body!;
if (response.headers.get('Pagination') != null) {
paginatedResult.pagination = JSON.parse(response.headers.get('Pagination')!);
}
return paginatedResult;
}));
}



getRecentEvents(): Observable<Event[]> {
  return this.http.get<Event[]>(this.baseUrl + 'publicevents/GetRecentEvents/');
}
getRecentEventsAuth(userId: number): Observable<Event[]> {
  return this.http.get<Event[]>(this.baseUrl + `users/${userId}/events/GetRecentEventsAuth/`);
}
getRelatedEvents(categories: number[]= []): Observable<Event[]> {
  return this.http.get<Event[]>
    (this.baseUrl + 'publicevents/GetRelatedEventsPublic/' + categories.map(x => x.toString()).join('_'));
}
getRelatedEventsAuth(categories: number[]= [], userId: number): Observable<Event[]> {
  return this.http.get<Event[]>(this.baseUrl + `users/${userId}/events/GetRelatedEvents/` +
    categories.map(x => x.toString()).join('_'));
}


  getCitiesOfProvince(province: string): Observable<City[]> {
    return this.http.get<City[]>(this.baseUrl + 'publicevents/GetCitiesOfProvincePublic/' + province);
  }
  getCitiesOfProvinceAuth(province: string, userId: any): Observable<City[]> {
    return this.http.get<City[]>(this.baseUrl + `users/${userId}/events/GetCitiesOfProvince/` + province);
  }


  getEventCategories(): Observable<EventCategory[]> {
    return this.http.get<EventCategory[]>(this.baseUrl + 'publiceventcategories/GetEventCategoriesPublic/');
  }
  getEventCategoriesAuth(userId: number): Observable<EventCategory[]> {
    return this.http.get<EventCategory[]>(this.baseUrl + `users/${userId}/eventcategories/GetEventCategories/`);
  }

  filterData(data: Event[], params: any, sort?: any, page?: any, perPage?: any) {
    if (params) {
      if (params.searchBox) {
        data = data.filter(x => x.eventTitle.includes(params.searchBox.substring(7, params.searchBox.length - 1)));
      }


      if (params.categoriesBox && params.categoriesBox[0] !== '-1') {
        const categories: EventCategorySet[] = [];
        params.categoriesBox.forEach((category: { name: any; }) => { categories.push(category.name); });
        const events: Event[] = [];
        data.filter(event =>
          event.eventCategorySetList.forEach(f => {
            if (categories.indexOf(f) > -1) {
              if (!events.includes(event)) {
                events.push(event);
              }
            }
          }));
        data = events;
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
