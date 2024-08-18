import { Component, OnInit, ViewChild, Renderer2, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MenuService } from '../menu.service';
import { Observable, Subject, BehaviorSubject, of } from 'rxjs';
import { Category } from 'src/app/models/category';
import { filter, tap, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { SignalRService } from 'src/app/services/signal-r.service';
import { ProjectComment } from 'src/app/models/project-comment';
import { ProjectAdminReply } from 'src/app/models/project-admin-reply';
import { AuthService } from 'src/app/services/auth.service';
import { Brand } from 'src/app/models/brand';
import { MatMenu, MatMenuPanel, MatMenuTrigger } from '@angular/material/menu';
import { Settings, AppSettings } from 'src/app/app.settings';
import { Router } from '@angular/router';
import { Search } from 'src/app/models/search';

import { BrandSearch } from 'src/app/models/brand-search';
import { OfficeProjectSearch } from 'src/app/models/office-project-search';
import { DesignOfficeSearch } from 'src/app/models/design-office-search';
import { Pagination } from 'src/app/models/pagination';
import { HomeSearch } from 'src/app/models/home-search';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  standalone: true,
  imports: [MatButtonModule],
  providers: [ MenuService ]
})
export class HorizontalMenuComponent implements OnInit  {
  hoveredButton = '';
  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger;
  // @ViewChild('objectmenu', {static: true}) menu: MatMenu;
  public selectedId = 0;
  public selectedMenuItem = '';
  
  public settings: Settings;
  @ViewChild('objectsMenu') objectsMenu: ElementRef;
  @ViewChild('roundImage') roundImage: ElementRef;
  @ViewChild('roundImageTexture') roundImageTexture: ElementRef;
  public colorMap = new Map<number, string[]>();
  public menuItemList: [];
 
  constructor(public router: Router,
              private authService: AuthService,
              private renderer2: Renderer2,
              public basicDataService: BasicDataService,
              public cdr: ChangeDetectorRef,
              public appSettings: AppSettings) {
                this.settings = this.appSettings.settings;
               }

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

  gotChecked($event: Event, id: number, menuItemText: string) {
    this.selectedId =  id  ;
    this.selectedMenuItem = menuItemText;
    }

  
    buttonEnter(id:number) {
      this.menuItemList.map((x1:any) => {
        if(x1.megaMenu && x1.id === id) {
          
          this.selectedId =  Math.min.apply(null, x1.bag.contentItems.map((x2:any) => x2.id));
          x1.bag.contentItems.map((x2:any) => {
            if(this.selectedId === +x2.id){
              this.selectedMenuItem =  x2.displayText ;              
            }
            
          })
          
        }
        
      });
    }

    openProductPageAll() {
      this.router.navigate(['/products']);
    }

    // isMoreLinkTurn() {
    //   if (this.objectsMenu) {
    //     this.isMoreLinkTurnSubject.next((this.objectsMenu.nativeElement.getElementsByTagName('ul').length +
    //     this.objectsMenu.nativeElement.getElementsByTagName('li').length >= 8));
    //     this.isMoreLinkTurnObservable = this.isMoreLinkTurnSubject.asObservable();
    //   }
    // }
    // countMenuItems(parentCount, childrenCurrentCount): Observable<boolean> {
    //   this.totalMenuItems += parentCount + childrenCurrentCount;
    //   this.totalMenuItemsSubject.next(this.totalMenuItems <= 8);
    //   return this.totalMenuItemsSubject.asObservable();
    // }
    openDesignOfficesPage() {
      // this.store.dispatch(new SaveDesignOfficeSearchForRequest(new DesignOfficeSearch({
      //   searchId: 1
      // })));
      this.router.navigate(['/designoffices']);
    }
    openProjectsPage() {
      // this.store.dispatch(new SaveOfficeProjectSearchForRequest(new OfficeProjectSearch({
      //   searchId: 1
      // })));
      this.router.navigate(['/officeprojects']);
    }

    openBlogsPage() {
      this.router.navigate(['/blogs']);
    }

    openBrandsPage() {
      this.router.navigate(['/brands']);
    }

    openAboutUsPage() {
      this.router.navigate(['/about']);
    }

    
    openMoodBoardsPage() {
      this.router.navigate(['/moodboard']);
    }

    openEventsPage() {
      this.router.navigate(['/event']);
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
