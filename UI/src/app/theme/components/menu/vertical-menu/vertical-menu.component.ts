import { Component, OnInit, Input } from '@angular/core';
import { MenuService } from '../menu.service';
import { Menu } from '../menu.model';
import { Observable } from 'rxjs';
import { Category } from 'src/app/models/category';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vertical-menu',
  templateUrl: './vertical-menu.component.html',
  styleUrls: ['./vertical-menu.component.scss'],
  providers: [ MenuService ]
})
export class VerticalMenuComponent implements OnInit {
  public menuItemList: [];
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

  onClick(menuId) {
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
    routeSegments.push(eval("(" + '{' + secondSegment + '}' + ")"));
  }

    this.router.navigate(routeSegments);
  }
}
