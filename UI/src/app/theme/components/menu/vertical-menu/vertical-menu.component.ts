import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../menu.service';
import { Menu } from '../menu.model';
import { Observable } from 'rxjs';

import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { BasicDataService } from '../../../../services/basic-data.service';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  providers: [ MenuService ],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule]
})
export class VerticalMenuComponent implements OnInit {
  public menuItemList: [] = [];
  public selectedId = 0;
  public colorMap = new Map<number, string[]>();
  constructor(public menuService: MenuService,
    public router: Router,
    public basicDataService: BasicDataService,) { }

  ngOnInit() {
    this.basicDataService.getMenuList().subscribe(x => {
      this.menuItemList = x.menu[0].menuItemsList.menuItems;
      
      this.menuItemList.map((x1:any) => {
        if(x1.megaMenu) {
          
          x1.bag.contentItems.map((x2:any) => {
            if(this.selectedId === 0) {
              this.selectedId = x2.id
            }
            
            this.colorMap.set(x2.id, [x2.darkBackground, x2.lightBackground])
           
          });
         
          
        }
        
      })
    });
  }

  onClick(menuId: any) {
    this.menuService.toggleMenuItem(menuId);
    this.menuService.closeOtherSubMenus(this.menuService.getVerticalMenuItems(), menuId);
  }
  
  navigateToPage(url: string, parameterList: string) {
    
    let secondSegment = parameterList ? parameterList.split('_').map(x => 
      ` "${x.split('-')[0]}" : "${x.split('-')[1]}" `).join(', ') : ''
  const routeSegments = []
  routeSegments.push('/' + url.split('/')[0]);
  if  (url.split('/')[1]) {
    routeSegments.push(+url.split('/')[1]);
  }
  if  (secondSegment) {
    routeSegments.push(JSON.parse(`{${secondSegment}}`));
  }

    this.router.navigate(routeSegments);
  }
}
