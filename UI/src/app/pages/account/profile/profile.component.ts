import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator, matchingPasswords } from 'src/app/theme/utils/app-validators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { ProfessionalArea } from 'src/app/models/professional-area';
import { User } from 'src/app/models/user';
import { AuthService } from 'src/app/services/auth.service';
import { tap, map } from 'rxjs/operators';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {
  professionalAreaList: Observable<ProfessionalArea[]>;
  selectedProfessionalAreaList: any[] = [];
  user: User = new User();
  public infoForm: FormGroup;
  public passwordForm: FormGroup;
  constructor(public fb: FormBuilder,
              private authService: AuthService,
              public snackBar: MatSnackBar,
              private cdRef: ChangeDetectorRef) { }

  ngOnInit() {
    // this.store.dispatch(new RefreshProfessionalAreaRequest());
    // this.infoForm = this.fb.group({
    //   name: ['', Validators.required],
    //   lastName: ['', Validators.required],
    //   mobilePhone: ['', Validators.required],
    //   phoneNumber: ['', Validators.required],
    //   email: ['', Validators.compose([Validators.required, emailValidator])],
    //   address: ['', Validators.required],
    //   postalCode: ['', Validators.required],
    //   professionAreaBox: ['', Validators.required],
    //   otherProfessions: [''],
    //   image: [''],
    //   business: ['', Validators.required],
    //   webSiteUrl: ['', Validators.required],
    //   facebookProfileUrl: [''],
    //   twitterProfileUrl: [''],
    //   linkedInProfileUrl: ['']
    // });
    // this.passwordForm = this.fb.group({
    //   currentPassword: ['', Validators.required],
    //   newPassword: ['', Validators.required],
    //   confirmNewPassword: ['', Validators.required]
    // }, {validator: matchingPasswords('newPassword', 'confirmNewPassword')});
  }

  ngAfterViewInit() {
    // this.professionalAreaList = this.store.select(getAllProfessionalAreas);
    // this.store.pipe(select(getUserById(this.authService.getDecodedToken().nameid)),
    // map((user) => {
    //   if (user) {
    //     this.infoForm.patchValue({
    //       name: user.name,
    //       lastName: user.lastName,
    //       mobilePhone: user.mobilePhone,
    //       phoneNumber: user.phoneNumber,
    //       email: user.email,
    //       address: user.address,
    //       postalCode: user.postalCode,
    //       otherProfessions: user.otherProfessionalArea,
    //       business: user.businessName,
    //       webSiteUrl: user.webSiteUrl,
    //       facebookProfileUrl: user.facebookProfileUrl,
    //       twitterProfileUrl: user.twitterProfileUrl,
    //       linkedInProfileUrl: user.linkedInProfileUrl,
    //       image: user.profilePicture
    //     });
    //   }
    // }))
    // .subscribe();
    this.cdRef.detectChanges();
  }

  public onInfoFormSubmit(values: Object): void {
    if (this.infoForm.valid) {
    
      this.user.userProfessionalAreaList = [];
      this.selectedProfessionalAreaList = this.infoForm.get('professionAreaBox').value;
      this.selectedProfessionalAreaList.map(c => {
      this.user.userProfessionalAreaList.push({
        professionalAreaId: c.professionalAreaId,
        professionalArea: null,
        user: null,
        userId: this.authService.getDecodedToken().nameid
      });
    });
      this.user.name = this.infoForm.get('name').value;
      this.user.lastName = this.infoForm.get('lastName').value;
      this.user.mobilePhone = this.infoForm.get('mobilePhone').value;
      this.user.phoneNumber = this.infoForm.get('phoneNumber').value;
      this.user.email = this.infoForm.get('email').value;
      this.user.address = this.infoForm.get('address').value;
      this.user.postalCode = this.infoForm.get('postalCode').value;
      this.user.otherProfessionalArea = this.infoForm.get('otherProfessions').value;
      this.user.businessName = this.infoForm.get('business').value;
      this.user.webSiteUrl = this.infoForm.get('webSiteUrl').value;
      this.user.facebookProfileUrl = this.infoForm.get('facebookProfileUrl').value;
      this.user.twitterProfileUrl = this.infoForm.get('twitterProfileUrl').value;
      this.user.linkedInProfileUrl = this.infoForm.get('linkedInProfileUrl').value;
      this.user.profilePicture = this.infoForm.get('image').value[0].preview;
     
      // this.store.dispatch(new RefreshUserUpdateRequest(this.user));
      this.snackBar.open('اطلاعات حساب کاربری با موفقیت به روز شد!', '×',
        { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

  public onPasswordFormSubmit(values: Object): void {
    if (this.passwordForm.valid) {
      this.snackBar.open('رمز عبور با موفقیت تغییر داده شد!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
    }
  }

}
