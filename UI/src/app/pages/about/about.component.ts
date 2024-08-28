import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatStepperModule } from '@angular/material/stepper';
import { RouterModule } from '@angular/router';

import { AppSettings, Settings } from '../../app.settings';
import { PageImages } from '../../models/page-images';
import { AuthService } from '../../services/auth.service';
import { InitializeService } from '../../services/initialize.service';
import { BrandsCarouselComponent } from '../../shared/brands-carousel/brands-carousel.component';
import { HeaderCarouselComponent } from '../../shared/header-carousel/header-carousel.component';
import { HeaderImageComponent } from '../../shared/header-image/header-image.component';
import { OurServicesComponent } from '../../shared/our-services/our-services.component';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule,  MatFormFieldModule,  MatCardModule,HeaderCarouselComponent, HeaderImageComponent, OurServicesComponent, BrandsCarouselComponent ],
})
export class AboutComponent implements OnInit {
  public slides: PageImages[] = [];
  public settings: Settings;
  constructor(public appSettings: AppSettings,
              public initializeService: InitializeService,
              private authService: AuthService) {
    this.settings = this.appSettings.createNew()
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
