import { Component, OnInit, ViewChild, Renderer2, ElementRef, ChangeDetectorRef, inject } from '@angular/core';
import { MenuService } from '../menu.service';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AppSettings, Settings } from '../../../../app.settings';
import { AuthService } from '../../../../services/auth.service';
import { BasicDataService } from '../../../../services/basic-data.service';
import { CommonModule } from '@angular/common';
import { MenuItem } from '../../../../models/query-menu/menu-item';


@Component({
  selector: 'app-horizontal-menu',
  templateUrl: './horizontal-menu.component.html',
  styleUrls: ['./horizontal-menu.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  providers: [ MenuService ]
})
export class HorizontalMenuComponent implements OnInit  {
  hoveredButton = '';
  enteredButton = false;
  isMatMenuOpen = false;
  isMatMenu2Open = false;
  prevButtonTrigger: any;
  // @ViewChild('objectmenu', {static: true}) menu: MatMenu;
  public selectedId = 0;
  public selectedMenuItem = '';
  
  public settings: Settings;
  @ViewChild('objectsMenu')
  objectsMenu!: ElementRef;
  @ViewChild('roundImage')
  roundImage!: ElementRef;
  @ViewChild('roundImageTexture')
  roundImageTexture!: ElementRef;
  public colorMap = new Map<number, string[]>();
  public menuItemList!: MenuItem[];
  public router = inject( Router);
  private authService = inject( AuthService);
  private renderer2 = inject( Renderer2);
  public basicDataService = inject( BasicDataService);
  public cdr = inject( ChangeDetectorRef);
  public appSettings = inject( AppSettings);
  constructor() {
                this.settings = this.appSettings.createNew();
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
      routeSegments.push(JSON.parse(`{${secondSegment}}`));
    }
 
      this.router.navigate(routeSegments);
    }

}
