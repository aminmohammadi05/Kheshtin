import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef, ViewEncapsulation, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Observable, Subscription } from 'rxjs';
import { distinctUntilChanged, map, tap } from 'rxjs/operators';
import * as moment from 'jalali-moment'; 
import { SignalRService } from 'src/app/services/signal-r.service';
import { AuthService } from 'src/app/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { ProjectComment } from 'src/app/models/project-comment';
import { ProjectAdminReply } from 'src/app/models/project-admin-reply';
import { UserFavorites } from 'src/app/models/user-favorites';
import { ProductsService } from 'src/app/services/products.service';
import { Router } from '@angular/router';
import { SlideInOutAnimation } from '../animations/slide-in-out';
import { UserMoodBoardCandidateProduct } from 'src/app/models/user-mood-board-candidate-product';
import { HomeSearch } from 'src/app/models/home-search';
import { Category } from 'src/app/models/category';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MatMenuTrigger } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { SearchDialogComponent } from './search-dialog/search-dialog.component';
import { AppSettings } from 'src/app/app.settings';

@Component({
  selector: 'app-toolbar1',
  styleUrls: ['./toolbar1.component.scss'],
  templateUrl: './toolbar1.component.html',
  encapsulation: ViewEncapsulation.None
})
export class Toolbar1Component implements OnInit {
  @Output() MenuIconClick: EventEmitter<any> = new EventEmitter<any>();
  @Output() TopToolbarHovered: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('searchField', { static: true }) searchField: any;
  @ViewChild('searchIcon') filterIcon: ElementRef;
  @ViewChild('searchMenu') userMenu: ElementRef;
  hide = false;
  userFavorites: Observable<UserFavorites[]>;
  userMoodBoardCandidates: Observable<UserMoodBoardCandidateProduct[]>;
  isUserAuthenticated: Observable<boolean>;
  isNotAuthenticated: Observable<boolean>;
  messageCount: Observable<number>;
  adminMessageCount: Observable<number>;
  unreadProjectComments: Observable<ProjectComment[]>;
  unreadProjectAdminReplies: Observable<ProjectAdminReply[]>;
  currentDate: string;
  router: string;
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
  
  constructor(public productService: ProductsService,
              public signalRService: SignalRService,
              public appSettings: AppSettings,
              public authService: AuthService,
              public searchDialog: MatDialog,
              public mediaObserver: MediaObserver,
              private _router: Router,
              private http: HttpClient) {
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
    this.MenuIconClick.emit();
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
