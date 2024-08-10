import { MediaMatcher } from '@angular/cdk/layout';
import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { MediaObserver } from '@angular/flex-layout';
import { Observable } from 'rxjs';
import { AppService } from 'src/app/app.service';
import * as momentj from 'jalali-moment';
import * as Moment from 'moment';

@Component({
  selector: 'app-event-detail-timeline-box',
  templateUrl: './event-detail-timeline-box.component.html',
  styleUrls: ['./event-detail-timeline-box.component.scss']
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
