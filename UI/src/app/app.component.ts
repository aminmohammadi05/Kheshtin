import { Component, AfterViewInit, OnInit, TransferState, Inject, PLATFORM_ID, makeStateKey, ViewChild } from '@angular/core';
import { Settings, AppSettings } from './app.settings';
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd, RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';
import 'lodash';
import { NgProgressRef } from 'ngx-progressbar';
import { PagesComponent } from './pages/pages.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgProgressRef, RouterOutlet, PagesComponent]
})
export class AppComponent implements OnInit, AfterViewInit {
  // @ViewChild(NgProgressRef) progressBar: NgProgressRef;
  // public loadingRouteConfig: boolean;
  // data: string;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public router: Router,
              public authService: AuthService,
              private transferState: TransferState, @Inject(PLATFORM_ID) private platformId: Object) {
    this.settings = this.appSettings.createNew()
   
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // const payload = new UserLogin('admin', '1234567a');
    // this.store.dispatch(new LogIn(payload));
    // this.router.events.subscribe(event => {
    //   if (event instanceof NavigationEnd) {
    //     setTimeout(() => {
    //       window.scrollTo(0, 0);
    //     });
    //   }
      
    // });
  }

}

