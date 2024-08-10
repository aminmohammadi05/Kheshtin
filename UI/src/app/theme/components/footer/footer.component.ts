import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from '../../utils/app-validators';
import * as moment from 'jalali-moment';
import { AppSettings } from 'src/app/app.settings';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
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
