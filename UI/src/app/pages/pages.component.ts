import { Component, OnInit, ViewChild, HostListener, AfterViewInit, ChangeDetectorRef, Inject, inject } from '@angular/core';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { Settings, AppSettings } from '../app.settings';
// import { SlideInOutAnimation } from '../theme/components/animations/slide-in-out';
import { BasicDataService } from '../services/basic-data.service';
import { CommonModule } from '@angular/common';

import { ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { FooterComponent } from '../theme/components/footer/footer.component';
import { Toolbar1Component } from '../theme/components/toolbar1/toolbar1.component';
import { VerticalMenuComponent } from '../theme/components/menu/vertical-menu/vertical-menu.component';
import { SlideInOutAnimation } from '../theme/components/animations/slide-in-out';
import { HomeComponent } from './home/home.component';


// import { GraphQLModule } from '../graphql.module';

@Component({
  selector: 'app-pages',
  templateUrl: './pages.component.html',
  styleUrls: ['./pages.component.scss'],
  animations: [SlideInOutAnimation],
  standalone: true,
  imports : [CommonModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatButtonModule, MatSidenavModule, FooterComponent, RouterModule, Toolbar1Component, VerticalMenuComponent],
 
})
export class PagesComponent implements OnInit, AfterViewInit {
  @ViewChild('sidenav', { static: true }) sidenav:any;  
  public toolbarTypes = [1, 2];
  public toolbarTypeOption!: number;
  public headerTypes = ['default', 'image', 'carousel'];
  public headerTypeOption!: string;
  public searchPanelVariants = [1, 2, 3];
  public searchPanelVariantOption!: number;
  public headerFixed: boolean = false;
  public showBackToTop: boolean = false;
  public scrolledCount = 0;
 public settings!: Settings;
  public appSettings = inject(AppSettings);
  public cdRef = inject(ChangeDetectorRef);

  public router = inject(Router);
  public basicDataService = inject(BasicDataService);
  constructor() {
    this.settings = this.appSettings.createNew();
  }

  ngOnInit() {
    this.toolbarTypeOption = this.settings.toolbar;    
    this.headerTypeOption = this.settings.header; 
    this.searchPanelVariantOption = this.settings.searchPanelVariant;
    
    this.cdRef.detectChanges();
  }

  
  public changeTheme(theme: string){
    this.settings.theme = theme;       
  }

  public chooseToolbarType(){
    this.settings.toolbar = this.toolbarTypeOption;
    // window.scrollTo(0,0);
  }

  public chooseHeaderType(){
    this.settings.header = this.headerTypeOption;    
    window.scrollTo(0,0);
    this.router.navigate(['/']);
  }

  public chooseSearchPanelVariant(){
    this.settings.searchPanelVariant = this.searchPanelVariantOption;
  }
     
 
  @HostListener('window:scroll') onWindowScroll() {
    const scrollTop = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop);
    (scrollTop > 300) ? this.showBackToTop = true : this.showBackToTop = false; 

    if(this.settings.stickyMenuToolbar){      
      let top_toolbar = document.getElementById('top-toolbar');
      if(top_toolbar){ 
        if(scrollTop >= top_toolbar.clientHeight ) {
          this.settings.mainToolbarFixed = true;
        }
        else{
          this.settings.mainToolbarFixed = false;
        } 
      }        
    } 
    
        
    let load_more = document.getElementById('load-more');
    if(load_more){
      if(window.innerHeight > load_more.getBoundingClientRect().top + 120){ 
        if(!this.settings.loadMore.complete){
          if(this.settings.loadMore.start){        
            if(this.scrolledCount < this.settings.loadMore.step){  
              this.scrolledCount++; 
              if(!this.settings.loadMore.load){ 
                this.settings.loadMore.load = true; 
              }
            }
            else{
              this.settings.loadMore.start = false;
              this.scrolledCount = 0;
            }
          }  
        }
      }
    }
  }
  

  public scrollToTop(){
    var scrollDuration = 200;
    var scrollStep = -window.pageYOffset  / (scrollDuration / 20);
    var scrollInterval = setInterval(()=>{
      if(window.pageYOffset != 0){
         window.scrollBy(0, scrollStep);
      }
      else{
        clearInterval(scrollInterval); 
      }
    },10);
    if(window.innerWidth <= 768){
      setTimeout(() => { window.scrollTo(0,0) });
    }
  }

  ngAfterViewInit(){
    // document.getElementById('preloader')!.classList.add('hide');
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {        
        this.sidenav.close();
        this.settings.mainToolbarFixed = false;
        setTimeout(() => {
          window.scrollTo(0,0);
        }); 
      }            
    });    
  }   
 

}
