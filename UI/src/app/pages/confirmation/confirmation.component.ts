import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss']
})
export class ConfirmationComponent implements OnInit {
  token = '';
  email = '';
  constructor(public appSettings: AppSettings,
              private activatedRoute: ActivatedRoute,
              private authService: AuthService,
              private cdr: ChangeDetectorRef,
              private router: Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params.token && params.email) {
        this.token = params.token;
        this.email = params.email;

      } else {
         this.router.navigate(['/**']);
      }
    });
  }

  navigateToLogin() {
    this.authService.confirmEmail(this.token, this.email).subscribe(x => {
      if (x) {
        this.router.navigate(['/login']);
      } else {
        this.router.navigate(['/**']);
      }
    });
  }
}
