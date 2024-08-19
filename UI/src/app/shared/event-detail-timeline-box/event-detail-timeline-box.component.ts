import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FlexLayoutModule, MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';
import * as momentj from 'jalali-moment';
import * as Moment from 'moment';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { NgxMasonryModule } from 'ngx-masonry';

@Component({
  selector: 'app-event-detail-timeline-box',
  templateUrl: './event-detail-timeline-box.component.html',
  styleUrls: ['./event-detail-timeline-box.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class EventDetailTimelineBoxComponent implements OnInit{
  @Input() recentEvents: any[];
  @ViewChild('widgetsContentBox', { read: ElementRef }) public widgetsContentBox: ElementRef<any>;
  public events = [];
  public days = [];
  constructor(public appService:AppService, public  mediaObserver: MediaObserver, private mediaMatcher: MediaMatcher,) {
    
  }

  ngOnInit() {
    
 
  }
  public scrollRight(): void {
    
    this.widgetsContentBox.nativeElement.scrollTo({ left: (this.widgetsContentBox.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    
    this.widgetsContentBox.nativeElement.scrollTo({ left: (this.widgetsContentBox.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }
  getRemainingTime(event) {
    return momentj(momentj(event.start).format('jYYYY-jM-jD')).diff(momentj(momentj(new Date()).format('jYYYY-jM-jD')), 'days')
  }
  getPersianDate(event) {
    return momentj(event.start).format('jYYYY/jM/jD');
  }
}
