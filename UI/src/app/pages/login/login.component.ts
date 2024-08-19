import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from 'src/app/services/auth.service';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { UserLogin } from 'src/app/models/user-login';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { ProductItemComponent } from 'src/app/shared/product-item/product-item.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, FlexLayoutModule, MatFormFieldModule, ReactiveFormsModule, MatButtonModule,MatListModule ]
})
export class LoginComponent implements OnInit {
  model: any = {};
  public loginForm: FormGroup;
  public hide = true;
  constructor(public fb: FormBuilder,
              public router: Router,
              public authService: AuthService) { }

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
