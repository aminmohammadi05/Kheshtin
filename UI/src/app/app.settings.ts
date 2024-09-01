import { Injectable, OnDestroy } from '@angular/core';

import { Observable, Subscription, distinctUntilChanged, observable, of } from 'rxjs';

export class Settings {
  
  public name!: string;            
  public theme!: string;
  public toolbar!: number;
  public stickyMenuToolbar!: boolean;
  public header!: string;
  public rtl!: boolean;
  public searchPanelVariant!: number;
  public searchOnBtnClick!: boolean;
  public currency!: string;

  // additional options
  public mainToolbarFixed!: boolean;
  public contentOffsetToTop!: boolean;
  public headerBgImage!: boolean;
  public loadMore!: {
    start: boolean;
    step: number;
    load: boolean;
    page: number;
    complete: boolean;
    result: number;
  };
    constructor(
                ) { 

                    
                }
}

@Injectable({
    providedIn: 'root'
  })
export class AppSettings implements OnDestroy {
    public isMobile!: Observable<boolean>;

    activeMediaQuery = '';
    constructor() {

    }
    ngOnDestroy(): void {

      }
      public createNew(): Settings {
        var settings = new Settings();
            settings.name = 'HouseKey';  // theme name
        
        settings.theme = 'custom-palette';      // blue, green, red, pink, purple, grey, orange-dark, orange-white
        settings.toolbar = 1;           // 1 or 2
        settings.stickyMenuToolbar = true;        // true = sticky, false = not sticky
        settings.header = 'carousel';   // default, image, carousel
        settings.rtl = true;       // true = rtl, false = ltr
        settings.searchPanelVariant = 1;           //  1, 2  or 3
        settings.searchOnBtnClick = false;       //  true = search on button click
        settings.currency = 'USD';       // USD, EUR

        // NOTE:  don't change additional options values, they used for theme performance
        settings.mainToolbarFixed = false;
        settings.contentOffsetToTop = false;
        settings.headerBgImage = false;
        settings.loadMore = 
        {
            start: false,
            step: 1,
            load: false,
            page: 1,
            complete: false,
            result: 0
        }
        return settings;
      }
    
   
    
        
   
}
