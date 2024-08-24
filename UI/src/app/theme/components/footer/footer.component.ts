import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from '../../utils/app-validators';
import moment from 'jalali-moment';

import { SocialIconsComponent } from '../social-icons/social-icons.component';
import { AppSettings } from '../../../app.settings';
import { LogoComponent } from '../../../shared/logo/logo.component';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss'],
  standalone: true,
  imports: [CommonModule, SocialIconsComponent, LogoComponent],
})
export class FooterComponent implements OnInit {
  constructor(public appSettings: AppSettings) { }

  ngOnInit() {
    
  }

  currentYear() {
    
      const today = moment();
      return today.locale('fa').format('YYYY');
  }

}
