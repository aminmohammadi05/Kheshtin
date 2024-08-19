import { Component, AfterViewInit, OnInit } from '@angular/core';
import { Settings, AppSettings } from './app.settings';
import { Router, NavigationEnd, RouteConfigLoadStart, RouteConfigLoadEnd, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import 'lodash';
import { NgProgressModule } from '@ngx-progressbar/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [NgProgressModule, RouterModule]
})
export class AppComponent implements OnInit, AfterViewInit {
  public loadingRouteConfig: boolean;
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public router: Router,
              public authService: AuthService) {
    this.settings = this.appSettings.settings;
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
