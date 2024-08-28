import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, FlexLayoutModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule,MatListModule ]
})
export class LoginComponent implements OnInit {
  model: any = {};
  public loginForm!: FormGroup;
  public hide = true;
  public fb= inject( FormBuilder);
              public router= inject( Router);
              public authService= inject( AuthService);
  constructor() { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      userName: [null, Validators.compose([Validators.required])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      rememberMe: false
    });
  }

  public onLoginFormSubmit(values: any): void {
    if (this.loginForm.valid) {
      // this.store.dispatch(new LogIn(new UserLogin(values.userName, values.password)));
      // this.authService.login(values).subscribe(next => {
      //   this.router.navigate(['/']);
      //   }, err => {
     
      //   });
    }
  }

}
