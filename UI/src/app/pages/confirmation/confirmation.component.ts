import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { AppSettings } from '../../app.settings';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, ]
})
export class ConfirmationComponent implements OnInit {
  token = '';
  email = '';
  public appSettings= inject( AppSettings);
              private activatedRoute= inject( ActivatedRoute);
              private authService= inject( AuthService);
              private cdr= inject( ChangeDetectorRef);
              private router= inject( Router);
  constructor() { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      if (params['token'] && params['email']) {
        this.token = params['token'];
        this.email = params['email'];

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
