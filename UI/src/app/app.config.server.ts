import { mergeApplicationConfig, ApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { appConfig } from './app.config';
import { AppSettings } from './app.settings';
import { HTTP_INTERCEPTORS, HttpClient, HttpHandler, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';
import { AppInterceptor } from './theme/utils/app-interceptor';
import { RefreshTokenInterceptorService } from './theme/utils/refresh-token-interceptor.service';
import { AddCsrfHeaderInterceptorService } from './theme/utils/add-csrf-header-interceptor.service';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(), 
    
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

export const config = mergeApplicationConfig(appConfig, serverConfig);
