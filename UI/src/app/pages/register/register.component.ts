import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators} from '@angular/forms';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchingPasswords, emailValidator } from 'src/app/theme/utils/app-validators';
import { User } from 'src/app/models/user';
import { UserService } from 'src/app/services/user.service';
import { ProfessionalArea } from 'src/app/models/professional-area';
import { UserProfessionalArea } from 'src/app/models/user-professional-area';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, AfterViewInit {

  professionalAreaList: Observable<ProfessionalArea[]>;
  selectedProfessionalAreaList: any[] = [];
  user: User = new User();
  public registerForm: FormGroup;
  public hide = true;
  public userTypes = [
    { id: 1, name: 'Agent' },
    { id: 2, name: 'Agency' },
    { id: 3, name: 'Buyer' }
  ];
  constructor(public fb: FormBuilder,
              public router: Router,
              public snackBar: MatSnackBar,
              private userService: UserService,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    // this.store.dispatch(new RefreshProfessionalAreaRequest());
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      lastName: ['', Validators.required],
      mobilePhone: ['', Validators.required],
      phoneNumber: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],    
      address: ['', Validators.required],
      postalCode: ['', Validators.required],
      professionAreaBox: ['', Validators.required],
      otherProfessions: [''],
      business: ['', Validators.required],
      webSiteUrl: ['', Validators.required],
      facebookProfileUrl: [''],
      twitterProfileUrl: [''],
      linkedInProfileUrl: ['']
    }, {validator: matchingPasswords('password', 'confirmPassword')});
  }
  ngAfterViewInit() {
    // this.professionalAreaList = this.store.select(getAllProfessionalAreas);
    this.cdRef.detectChanges();
  }

  public onRegisterFormSubmit(values: Object): void {
    if (this.registerForm.valid) {
      this.user.userProfessionalAreaList = [];
      this.selectedProfessionalAreaList = this.registerForm.get('professionAreaBox').value;
      this.selectedProfessionalAreaList.map(c => {
      this.user.userProfessionalAreaList.push({
        professionalAreaId: c.professionalAreaId,
        professionalArea: null,
        user: null,
        userId: 0
      });
    });
      this.user.name = this.registerForm.get('name').value;
      this.user.lastName = this.registerForm.get('lastName').value;
      this.user.password = this.registerForm.get('password').value;
      this.user.mobilePhone = this.registerForm.get('mobilePhone').value;
      this.user.phoneNumber = this.registerForm.get('phoneNumber').value;
      this.user.email = this.registerForm.get('email').value;
      this.user.address = this.registerForm.get('address').value;
      this.user.postalCode = this.registerForm.get('postalCode').value;
      this.user.otherProfessionalArea = this.registerForm.get('otherProfessions').value;
      this.user.businessName = this.registerForm.get('business').value;
      this.user.webSiteUrl = this.registerForm.get('webSiteUrl').value;
      this.user.facebookProfileUrl = this.registerForm.get('facebookProfileUrl').value;
      this.user.twitterProfileUrl = this.registerForm.get('twitterProfileUrl').value;
      this.user.linkedInProfileUrl = this.registerForm.get('linkedInProfileUrl').value;

      // this.store.dispatch(new RefreshUserRegisterRequest(this.user));
      // this.store.pipe(select(getRegisteredUser(this.user)),
      // tap(user => {
      //   if (user) {
      //     this.snackBar.open('ثبت نام با موفقیت انجام شد', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      //   }
      // }));
   
    }
  }

  onThumbnailSelected(event) {
    if (event.target.files &&
      event.target.files[0].size < 5 * 1024 * 1024 ) {
        const reader = new FileReader();

        reader.onload = ((file: File) => {
          return (evt) => {
            this.user.profilePicture = 'data:' + event.target.files[0].type + ';base64,' + btoa(evt.target.result as string);
          };
        })(event.target.files[0]);

        reader.readAsBinaryString(event.target.files[0]);
    }
  }
}
