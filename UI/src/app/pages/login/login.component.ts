import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router'; 
import { AuthService } from 'src/app/services/auth.service';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { UserLogin } from 'src/app/models/user-login';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
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
