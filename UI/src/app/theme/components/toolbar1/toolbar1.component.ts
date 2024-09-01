import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, OnDestroy, inject } from '@angular/core';

import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import moment from 'jalali-moment'; 

import { Router } from '@angular/router';



import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';

import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HorizontalMenuComponent } from '../menu/horizontal-menu/horizontal-menu.component';
import { SocialIconsComponent } from '../social-icons/social-icons.component';
import { ContactsComponent } from '../contacts/contacts.component';

import { UserMenuComponent } from '../user-menu/user-menu.component';
import { LangComponent } from '../lang/lang.component';
import { CurrencyComponent } from '../currency/currency.component';
import { UserFavorites } from '../../../models/user-favorites';
import { UserMoodBoardCandidateProduct } from '../../../models/user-mood-board-candidate-product';
import { ProjectComment } from '../../../models/project-comment';
import { ProjectAdminReply } from '../../../models/project-admin-reply';
import { HomeSearch } from '../../../models/home-search';
import { LogoComponent } from '../../../shared/logo/logo.component';
import { ProductsService } from '../../../services/products.service';
import { SignalRService } from '../../../services/signal-r.service';
import { AppSettings } from '../../../app.settings';
import { AuthService } from '../../../services/auth.service';
// import { HttpClient } from '@aspnet/signalr';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-toolbar1',
  styleUrls: ['./toolbar1.component.scss'],
  templateUrl: './toolbar1.component.html',
  standalone: true,
  imports: [CommonModule, MatFormFieldModule, MatInputModule, MatIconModule, MatToolbarModule, HorizontalMenuComponent, SocialIconsComponent, ContactsComponent, LogoComponent, UserMenuComponent, LangComponent, CurrencyComponent],
  encapsulation: ViewEncapsulation.None
})
export class Toolbar1Component implements OnInit {
  @Output() MenuIconClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() TopToolbarHovered: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('searchField', { static: true }) searchField: any;
  @ViewChild('searchIcon')
  filterIcon!: ElementRef;
  @ViewChild('searchMenu')

  public productService = inject(ProductsService);
  public signalRService = inject(SignalRService);
  public appSettings= inject(AppSettings);
  public authService= inject(AuthService);
  public searchDialog= inject(MatDialog);
  private _router= inject(Router);
  // private http= inject(HttpClient);


  userMenu!: ElementRef;
  hide = false;
  userFavorites!: Observable<UserFavorites[]>;
  userMoodBoardCandidates!: Observable<UserMoodBoardCandidateProduct[]>;
  isUserAuthenticated!: Observable<boolean>;
  isNotAuthenticated!: Observable<boolean>;
  messageCount!: Observable<number>;
  adminMessageCount!: Observable<number>;
  unreadProjectComments!: Observable<ProjectComment[]>;
  unreadProjectAdminReplies!: Observable<ProjectAdminReply[]>;
  currentDate!: string;
  router!: string;
  searchClicked = false;
  public searchFields = new HomeSearch({
    searchId: 1,
    brandsBox: [],
    categoriesBoxNested: [],
    brandCollectionBox: [],
    categoriesBox: [],
    fileTypes: [],
    searchBox: '',
    imageUploaded: ''
  });
  
  
  isMobile = false;

  
  constructor() {
               // console.log(this.appSettings.settings.isMobile)
               
               }


  ngOnInit() {
    
    // this.userFavorites = this.store.pipe(select(getAllUserFavorites));
    // this.userMoodBoardCandidates = this.store.pipe(select(getAllUserMoodBoardCandidateProducts));
    // this.isUserAuthenticated = this.store.pipe(
    //   map(state => state.logins.isAuthenticated));
    // this.isNotAuthenticated = this.store.pipe(
    //   map(state => !state.logins.isAuthenticated));
   }

  public sidenavToggle() {
    // this.MenuIconClick.emit();
  }
 
  runSignalRInitMethods() {
    this.currentDate = moment(new Date()).locale('fa').format('YYYY/MM/DD');
    this.getUnreadMessagesCount();
    this.getAdminReplies();
    this.unreadProjectComments = this.signalRService.commentsCurrentData;
    this.unreadProjectAdminReplies = this.signalRService.adminRepliesCurrentData;
    this.messageCount = this.unreadProjectComments.pipe(map(comments => comments.length));
    this.adminMessageCount = this.unreadProjectAdminReplies.pipe(map(replies => replies.length));
  }

  private getUnreadMessagesCount = () => {
    // this.store.pipe(
    //   map(state => {
    //     if (state.logins.isAuthenticated) {
    //       this.store.dispatch(new ProjectsApprovedUnreadComments(
    //                                 state.logins.entities[0].token,
    //                                 state.logins.entities[0].userId));
    //     }
    //   }));
  }

  private getAdminReplies = () => {
    // this.store.pipe(
    //   map(state => {
    //     if (state.logins.isAuthenticated) {
    //       this.store.dispatch(new ProjectsUnreadAdminReplies(
    //                                 state.logins.entities[0].token,
    //                                 state.logins.entities[0].userId));
    //     }
    //   }));
  }
  search() {
    this.searchFields.searchBox = this.searchField.nativeElement.value;
    // this.store.dispatch(new SaveHomeSearchForRequest(this.searchFields));
    // this._router.navigate(['/products']);
    this._router.navigate(['/blogs/1', {search: this.searchFields.searchBox ? this.searchFields.searchBox : null, categories: null}]);
  }
  openSearchField(){
    this.searchClicked = !this.searchClicked;
  }
  openShowRoom() {
    if (this.authService.loggedIn()) {
      this._router.navigate(['/textureshowroom']);
    } else {
      this._router.navigate(['/login']);
    }
  }
  openMoodBoardMaker() {
    if (this.authService.loggedIn()) {
      this._router.navigate(['/designmoodboard']);
    } else {
      this._router.navigate(['/login']);
    }
  }
}
