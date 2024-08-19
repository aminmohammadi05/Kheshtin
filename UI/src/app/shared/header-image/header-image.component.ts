import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { DomSanitizer} from '@angular/platform-browser'
import { Settings, AppSettings } from '../../app.settings';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-header-image',
  templateUrl: './header-image.component.html',
  styleUrls: ['./header-image.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderImageComponent implements OnInit {
  @Input('backgroundImage') backgroundImage;
  @Input('bgImageAnimate') bgImageAnimate;
  @Input('contentOffsetToTop') contentOffsetToTop;
  @Input('contentMinHeight') contentMinHeight;
  @Input('title') title;
  @Input('desc') desc;
  @Input('isHomePage') isHomePage:boolean = false;
  public bgImage;
  public settings: Settings;
  constructor(public appSettings:AppSettings, private cdRef: ChangeDetectorRef, private sanitizer:DomSanitizer) {
    this.settings = this.appSettings.settings;
    this.settings.headerBgImage = true;
  }

  ngOnInit() {
    if(this.contentOffsetToTop){
      this.settings.contentOffsetToTop = this.contentOffsetToTop;
      this.cdRef.detectChanges();
    }
      
    if(this.backgroundImage) 
      this.bgImage = this.sanitizer.bypassSecurityTrustStyle('url('+this.backgroundImage +')'); 
  }

  ngOnDestroy(){    
    this.settings.headerBgImage = false; 
    this.settings.contentOffsetToTop = false;
  }

}
