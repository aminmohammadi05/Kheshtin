import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { HeaderImageComponent } from '../../shared/header-image/header-image.component';
import { emailValidator } from '../../theme/utils/app-validators';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatCardModule, ReactiveFormsModule, FlexLayoutModule, HeaderImageComponent]
})
export class ContactComponent implements OnInit {
  public contactForm!: FormGroup;
  public lat: number = 40.678178;
  public lng: number = -73.944158;
  public zoom: number = 12; 
  constructor(public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  public onContactFormSubmit(values:Object):void {
    if (this.contactForm.valid) {
     
    }
  }

}
