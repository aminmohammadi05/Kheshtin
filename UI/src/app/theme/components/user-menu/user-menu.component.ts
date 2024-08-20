import { Component, OnInit, ChangeDetectorRef, AfterViewInit, ViewEncapsulation, Renderer2, ElementRef, ViewChild, Inject } from '@angular/core';

import { Observable } from 'rxjs';

import { DOCUMENT } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { User } from '../../../models/user';
import { AuthService } from '../../../services/auth.service';


@Component({
  selector: 'app-user-menu',
  templateUrl: './user-menu.component.html',
  styleUrls: ['./user-menu.component.scss'],
  standalone: true,
  imports: [MatMenuModule, MatIconModule],
})
export class UserMenuComponent implements OnInit, AfterViewInit {
  public user!: Observable<User>;
  @ViewChild('userMenu')
  userMenu!: ElementRef;
  constructor(
              public authService: AuthService,
              private cdRef: ChangeDetectorRef) {}

  ngOnInit() {
    // this.user = this.store.pipe(select(getUserById(this.authService.getDecodedToken().nameid)));
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }

  logout() {
    // this.store.dispatch(new LogOut(new Login(this.authService.getJwtToken(),
    // this.authService.getRefreshToken(),
    // this.authService.getDecodedToken().nameid,
    // null)));
  }

}
