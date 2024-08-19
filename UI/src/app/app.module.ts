import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';


// import { InputFileConfig, InputFileModule } from 'ngx-input-file';
// const config: InputFileConfig = {
//   fileAccept: '*'
// };

import { OverlayContainer } from '@angular/cdk/overlay';
import { CustomOverlayContainer } from './theme/utils/custom-overlay-container';

import { AppRouting } from './app.routing';
import { AppSettings } from './app.settings';
import { AppInterceptor } from './theme/utils/app-interceptor';


import { RefreshTokenInterceptorService } from './theme/utils/refresh-token-interceptor.service';
import { AddCsrfHeaderInterceptorService } from './theme/utils/add-csrf-header-interceptor.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
// import { SwiperModule } from 'ngx-swiper-wrapper';


@NgModule({ declarations: [
        // AppComponent,
        // PagesComponent,
        // NotFoundComponent,
        // UserMenuComponent,
        // CurrencyComponent,
        // LangComponent,
        // SocialIconsComponent,
        // ContactsComponent,
        // Toolbar1Component,
        // Toolbar2Component,
        // HorizontalMenuComponent,
        // VerticalMenuComponent,
        // FooterComponent,
        // LockScreenComponent
    ],
    bootstrap: [], imports: [BrowserModule,
        // SwiperModule,
        BrowserAnimationsModule,
        FormsModule,

        
        // InputFileModule.forRoot(config),
        AppRouting,
        FontAwesomeModule
        ], providers: [
        AppSettings,
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
    ] })
export class AppModule { }
