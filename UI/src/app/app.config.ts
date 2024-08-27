import { ApplicationConfig, provideExperimentalZonelessChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';
import { provideAnimations } from '@angular/platform-browser/animations';

const uri = 'https://orchard.kheshtin.ir/api/graphql';
export function createApollo(httpLink: HttpLink) {
	return {
	  link: httpLink.create({ uri }),
	  cache: new InMemoryCache(),
	  defaultOptions: {
		watchQuery: {
		  fetchPolicy: 'no-cache',
		  errorPolicy: 'ignore',
		},
		query: {
		  fetchPolicy: 'no-cache',
		  errorPolicy: 'all',
		},
	  }
	};
  }
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]      
      },
      Apollo,
      
      provideExperimentalZonelessChangeDetection(),
    provideClientHydration(),
    provideHttpClient(withInterceptorsFromDi()),
    provideAnimations(),
     provideRouter(routes),
      
    ]
};
