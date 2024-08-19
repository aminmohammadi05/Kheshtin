import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { AppSettings, Settings } from 'src/app/app.settings';
import { LogoComponent } from 'src/app/shared/logo/logo.component';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, FlexLayoutModule, MatFormFieldModule, MatSidenavModule, ReactiveFormsModule, MatButtonModule,MatListModule, MatToolbarModule, LogoComponent ] 
})
export class LandingComponent implements OnInit {
 
  public settings: Settings;
  constructor(public appSettings:AppSettings, public router:Router) {
    this.settings = this.appSettings.settings;  
  }

  ngOnInit() {
  }

  ngAfterViewInit(){
    document.getElementById('preloader').classList.add('hide');
  }

  public getDemo(number){
    if(number == 1){
      this.settings.toolbar = 1;
      this.settings.header = 'default';
      this.settings.theme = 'blue';
      this.settings.rtl = false;
    }
    if(number == 2){
      this.settings.toolbar = 1;
      this.settings.header = 'image';
      this.settings.theme = 'blue';
      this.settings.rtl = false;
    }
    if(number == 3){
      this.settings.toolbar = 1;
      this.settings.header = 'carousel';
      this.settings.theme = 'blue';
      this.settings.rtl = false;
    }
    if(number == 4){
      this.settings.toolbar = 2;
      this.settings.header = 'image';
      this.settings.theme = 'blue';
      this.settings.rtl = false;
    }
    if(number == 5){
      this.settings.toolbar = 2;
      this.settings.header = 'image';
      this.settings.theme = 'orange-dark';
      this.settings.rtl = false;
    }
    if(number == 6){
      this.settings.toolbar = 1;
      this.settings.header = 'image';
      this.settings.theme = 'blue';
      this.settings.rtl = true;
    }
    this.router.navigate(['/']);
  }

  public getSkin(num){
    if(num == 1){
      this.settings.theme = 'blue';
      this.settings.header = "carousel";
    }
    if(num == 2){
      this.settings.theme = 'green';
      this.settings.header = "carousel";
    }
    if(num == 3){
      this.settings.theme = 'red';
      this.settings.header = "carousel";
    }
    if(num == 4){
      this.settings.theme = 'pink';
      this.settings.header = "carousel";
    }
    if(num == 5){
      this.settings.theme = 'purple';
      this.settings.header = "carousel";
    }
    if(num == 6){
      this.settings.theme = 'grey';
      this.settings.header = "carousel";

    }
    this.settings.toolbar = 1;
    this.settings.rtl = false;
    
    this.router.navigate(['/']);
  }


  public scrollToDemos() {
    var elmnt = document.getElementById("demos");
    elmnt.scrollIntoView({behavior: "smooth"});
  }
  public goToTop(){
    var elmnt = document.getElementById("top");
    elmnt.scrollIntoView({behavior: "smooth"});
  }

}
