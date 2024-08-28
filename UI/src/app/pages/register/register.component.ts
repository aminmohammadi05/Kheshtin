import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule} from '@angular/forms';
import { Router } from '@angular/router'; 
import { MatSnackBar } from '@angular/material/snack-bar';


import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProfessionalArea } from '../../models/professional-area';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [CommonModule,MatIconModule, MatCardModule, MatExpansionModule,  FlexLayoutModule, MatDividerModule, ReactiveFormsModule, MatFormFieldModule, FontAwesomeModule],
})
export class RegisterComponent implements OnInit, AfterViewInit {

  professionalAreaList!: Observable<ProfessionalArea[]>;
  selectedProfessionalAreaList: any[] = [];
  user: User = new User();
  public registerForm!: FormGroup;
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
      this.selectedProfessionalAreaList = this.registerForm.get('professionAreaBox')!.value;
      this.selectedProfessionalAreaList.map(c => {
      this.user.userProfessionalAreaList.push({
        professionalAreaId: c.professionalAreaId,
        professionalArea: new ProfessionalArea(),
        user: new User(),
        userId: 0
      });
    });
      this.user.name = this.registerForm.get('name')!.value;
      this.user.lastName = this.registerForm.get('lastName')!.value;
      this.user.password = this.registerForm.get('password')!.value;
      this.user.mobilePhone = this.registerForm.get('mobilePhone')!.value;
      this.user.phoneNumber = this.registerForm.get('phoneNumber')!.value;
      this.user.email = this.registerForm.get('email')!.value;
      this.user.address = this.registerForm.get('address')!.value;
      this.user.postalCode = this.registerForm.get('postalCode')!.value;
      this.user.otherProfessionalArea = this.registerForm.get('otherProfessions')!.value;
      this.user.businessName = this.registerForm.get('business')!.value;
      this.user.webSiteUrl = this.registerForm.get('webSiteUrl')!.value;
      this.user.facebookProfileUrl = this.registerForm.get('facebookProfileUrl')!.value;
      this.user.twitterProfileUrl = this.registerForm.get('twitterProfileUrl')!.value;
      this.user.linkedInProfileUrl = this.registerForm.get('linkedInProfileUrl')!.value;

      // this.store.dispatch(new RefreshUserRegisterRequest(this.user));
      // this.store.pipe(select(getRegisteredUser(this.user)),
      // tap(user => {
      //   if (user) {
      //     this.snackBar.open('ثبت نام با موفقیت انجام شد', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
      //   }
      // }));
   
    }
  }

  onThumbnailSelected(event: { target: { files: Blob[]; }; }) {
    // if (event.target.files &&
    //   event.target.files[0].size < 5 * 1024 * 1024 ) {
    //     const reader = new FileReader();

    //     reader.onload = ((file: File) => {
    //       return (evt) => {
    //         this.user.profilePicture = 'data:' + event.target.files[0].type + ';base64,' + btoa(evt.target!.result as string);
    //       };
    //     })(event.target.files[0]);

    //     reader.readAsBinaryString(event.target.files[0]);
    // }
  }
}
