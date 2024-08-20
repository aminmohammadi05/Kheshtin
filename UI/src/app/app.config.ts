import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';


import { provideClientHydration } from '@angular/platform-browser';
import { routes } from './app.routes';
import { AppSettings } from './app.settings';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppInterceptor } from './theme/utils/app-interceptor';
import { RefreshTokenInterceptorService } from './theme/utils/refresh-token-interceptor.service';
import { AddCsrfHeaderInterceptorService } from './theme/utils/add-csrf-header-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
     provideRouter(routes),
      provideClientHydration(),
      // AppSettings,
      // { provide: OverlayContainer, useClass: CustomOverlayContainer },
      // { provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true },
      // {
      //     provide: HTTP_INTERCEPTORS,
      //     useClass: RefreshTokenInterceptorService,
      //     multi: true
      // },
      // {
      //     provide: HTTP_INTERCEPTORS,
      //     useClass: AddCsrfHeaderInterceptorService,
      //     multi: true
      // },
      // provideHttpClient(withInterceptorsFromDi()),
    ]
};
