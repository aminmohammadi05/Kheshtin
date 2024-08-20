import { Injectable, OnDestroy } from '@angular/core';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { Observable, Subscription, distinctUntilChanged, observable, of } from 'rxjs';

export class Settings {
    
    constructor(public name: string,            
                public theme: string,
                public toolbar: number,
                public stickyMenuToolbar: boolean,
                public header: string,
                public rtl: boolean,
                public searchPanelVariant: number,
                public searchOnBtnClick: boolean,
                public currency: string,

                // additional options
                public mainToolbarFixed: boolean,
                public contentOffsetToTop: boolean,
                public headerBgImage: boolean,
                public loadMore: {
                    start: boolean,
                    step: number,
                    load: boolean,
                    page: number,
                    complete: boolean,
                    result: number
                }
                ) { 
                    
                }
}

@Injectable()
export class AppSettings implements OnDestroy {
    public isMobile!: Observable<boolean>;
    public mediaSubscription: Subscription;
    activeMediaQuery = '';
    constructor(public mediaObserver: MediaObserver) {
        const getAlias = (mediaChange: MediaChange[]) => {
            return mediaChange[0].mqAlias;
          };
        this.mediaSubscription = this.mediaObserver.asObservable().pipe(distinctUntilChanged(
            (x: MediaChange[], y: MediaChange[]) => getAlias(x) === getAlias(y)
              )).subscribe((change) => {
                  change.forEach((item) => {
                      this.activeMediaQuery = item ? `'${item.mqAlias}' = (${item.mediaQuery})` : '';                                                   
                      if (item.mqAlias === 'sm' || item.mqAlias === 'xs' ) {
                        
                        
                        this.isMobile = of(true);

                      }
              });
});
    }
    ngOnDestroy(): void {
        this.mediaSubscription.unsubscribe();
      }
    public settings = new Settings(
        'HouseKey',  // theme name
        
        'custom-palette',      // blue, green, red, pink, purple, grey, orange-dark, orange-white
        1,           // 1 or 2
        true,        // true = sticky, false = not sticky
        'carousel',   // default, image, carousel
        true,       // true = rtl, false = ltr
        1,           //  1, 2  or 3
        false,       //  true = search on button click
        'USD',       // USD, EUR

        // NOTE:  don't change additional options values, they used for theme performance
        false,
        false,
        false,
        {
            start: false,
            step: 1,
            load: false,
            page: 1,
            complete: false,
            result: 0
        }
    );
}
