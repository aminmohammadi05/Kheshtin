import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AppService } from 'src/app/app.service';
import { HorizontalMenuComponent } from '../menu/horizontal-menu/horizontal-menu.component';
import { SocialIconsComponent } from '../social-icons/social-icons.component';

import { ContactsComponent } from '../contacts/contacts.component';
import { LogoComponent } from 'src/app/shared/logo/logo.component';
import { UserMenuComponent } from '../user-menu/user-menu.component';
import { LangComponent } from '../lang/lang.component';
import { CurrencyComponent } from '../currency/currency.component';

@Component({
  selector: 'app-toolbar2',
  templateUrl: './toolbar2.component.html',
  standalone: true,
  imports: [MatIconModule, MatToolbarModule, HorizontalMenuComponent, SocialIconsComponent, ContactsComponent, LogoComponent, UserMenuComponent, LangComponent, CurrencyComponent]
})
export class Toolbar2Component implements OnInit {
  @Output() onMenuIconClick: EventEmitter<any> = new EventEmitter<any>();
  constructor(public appService:AppService) { }

  ngOnInit() { }

  public sidenavToggle(){
    this.onMenuIconClick.emit();
  }
}