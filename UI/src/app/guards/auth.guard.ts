import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertifyService } from '../services/alertify.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Settings, AppSettings } from '../app.settings';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {
  public settings: Settings;
  constructor(private authService: AuthService,
              private router: Router,
              private snackBar: MatSnackBar,
              public appSettings: AppSettings) {
                this.settings = this.appSettings.settings;
              }
  canActivate(): boolean {
       if (this.authService.loggedIn()) {
         return true;
       }
       this.snackBar.open('برای ورود به این بغش ابتدا احراز هویت کنید', '×', {
        verticalPosition: 'top',
        duration: 3000,
        direction: (this.settings.rtl) ? 'rtl' : 'ltr'
      });
       this.router.navigate(['/login']);
       return false;
  }
}
