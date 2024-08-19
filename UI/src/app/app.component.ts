import { Component, AfterViewInit, OnInit, TransferState, Inject, PLATFORM_ID, makeStateKey, ViewChild } from '@angular/core';
import { Settings, AppSettings } from './app.settings';
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import 'lodash';
import { NgProgressRef } from 'ngx-progressbar';
import { isPlatformBrowser } from '@angular/common';
const STATE_KEY = makeStateKey<string>('exampleKey');

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgProgressRef, RouterModule]
})
export class AppComponent implements OnInit, AfterViewInit {
  @ViewChild(NgProgressRef) progressBar: NgProgressRef;
  public loadingRouteConfig: boolean;
  data: string;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public router: Router,
              public authService: AuthService,
              private transferState: TransferState, @Inject(PLATFORM_ID) private platformId: Object) {
    this.settings = this.appSettings.settings;
    if (isPlatformBrowser(this.platformId)) {
      this.data = this.transferState.get(STATE_KEY, 'default value');
      } else {
      this.transferState.set(STATE_KEY, 'server value');
      }
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    // const payload = new UserLogin('admin', '1234567a');
    // this.store.dispatch(new LogIn(payload));
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        });
      }
      if (event instanceof RouteConfigLoadStart) {
        this.loadingRouteConfig = true;
      } else if (event instanceof RouteConfigLoadEnd) {
          this.loadingRouteConfig = false;
      }
    });
  }

}
