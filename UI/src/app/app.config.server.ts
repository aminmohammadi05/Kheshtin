import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { AppSettings } from './app.settings';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';

import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { AppInterceptor } from './theme/utils/app-interceptor';
import { RefreshTokenInterceptorService } from './theme/utils/refresh-token-interceptor.service';
import { AddCsrfHeaderInterceptorService } from './theme/utils/add-csrf-header-interceptor.service';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache } from '@apollo/client/cache';
import { Apollo, APOLLO_OPTIONS } from 'apollo-angular';

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
const serverConfig: ApplicationConfig = {
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink]      
      },
      
    { provide: OverlayContainer, useClass: CustomOverlayContainer },
    { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: RefreshTokenInterceptorService,
        multi: true
    },
    {
        provide: HTTP_INTERCEPTORS,
        useClass: AddCsrfHeaderInterceptorService,
        multi: true
    },
    provideHttpClient(withInterceptorsFromDi()),   
    Apollo,
    provideServerRendering(),
    
  ]
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
