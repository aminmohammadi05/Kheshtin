import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from 'src/app/app.settings';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, FlexLayoutModule]
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
