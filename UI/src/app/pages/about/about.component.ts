import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from 'src/app/app.settings';
import { Observable } from 'rxjs';
import { PageImages } from 'src/app/models/page-images';
import { AuthService } from 'src/app/services/auth.service';
import { InitializeService } from 'src/app/services/initialize.service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  public slides: PageImages[] = [];
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public initializeService: InitializeService,
              private authService: AuthService) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    // this.getSlides();
  }
  public getSlides() {
    if (this.authService.loggedIn()) {
      this.initializeService.getPageImagesAuth(this.authService.getDecodedToken().nameid, 6).subscribe(x => {
        this.slides = x;
      });
    } else {
      this.initializeService.getPageImages(6).subscribe(x => {
        this.slides = x;
      });
    }
  }
}
