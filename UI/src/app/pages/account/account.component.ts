import { Component, OnInit, ViewChild, HostListener, AfterViewInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart, RouterModule } from '@angular/router';
import {  } from 'ngx-scrollbar';
import { AuthService } from 'src/app/services/auth.service';
import { Login } from 'src/app/models/login';
import { User } from 'src/app/models/user';
import { Observable, BehaviorSubject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatStepperModule,  MatFormFieldModule, MatSidenavModule, MatCardModule, MatButtonModule, RouterModule ],
})
export class AccountComponent implements OnInit, AfterViewInit {
  loggedInUser: Observable<User>;
  public psConfig = {
    wheelPropagation: true
  };
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen = true;
  public links = [
    { name: 'پروفایل', href: 'profile', icon: 'person' },
    // { name: 'پروژه های من', href: 'my-projects', icon: 'view_list' },
    { name: 'مودبرد های من', href: 'mymoodboards', icon: 'view_list' },
    { name: 'علایق', href: 'favorites', icon: 'favorite' },
    // { name: 'ارسال پروژه', href: 'designmoodboard', icon: 'add_circle' },
    { name: 'ایجاد مودبرد ', href: '/designmoodboard', icon: 'add_circle' },
    { name: 'خروج', href: '/login', icon: 'power_settings_new' },
  ];
  constructor(public router: Router,
              public authService: AuthService) { }

  ngOnInit() {
    // this.loggedInUser = this.store.select(getUserById(this.authService.getDecodedToken().nameid));
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
    }
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (window.innerWidth < 960) {
          this.sidenav.close();
        }
      }
      if (event instanceof NavigationStart) {
        if ((event as NavigationStart).url === '/login') {
          this.logout();
        }
      }

    });
  }
  logout() {
    if (this.authService.loggedIn()) {
      // this.store.dispatch(new LogOut(new Login(this.authService.getJwtToken(),
      // this.authService.getRefreshToken(),
      // this.authService.getDecodedToken().nameid,
      // null)));
    }
  }

}
