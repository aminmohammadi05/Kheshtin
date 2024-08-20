import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from '../../../app.settings';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-currency',
  templateUrl: './currency.component.html',
  styleUrls: ['./currency.component.scss'],
  standalone: true,
  imports: [MatMenuModule, MatIconModule, MatButtonModule]
})
export class CurrencyComponent implements OnInit {
  public currencies = ['USD', 'EUR'];
  public currency:any; 
  public settings: Settings;
  constructor(public appSettings:AppSettings) {
    this.settings = this.appSettings.settings;
  }

  ngOnInit() {
    this.currency = this.settings.currency;
  }
  
  public changeCurrency(currency: string){
    this.currency = currency;
    this.settings.currency = currency;
  } 

}
