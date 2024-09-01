import { Component, Input } from '@angular/core';
import momentj from 'jalali-moment';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Observable, Subscription } from 'rxjs';
const moment = extendMoment(Moment);
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { Event } from '../../models/query-home-event/event';

@Component({
  selector: 'app-event-timeline-vertical',
  templateUrl: './event-timeline-vertical.component.html',
  styleUrls: ['./event-timeline-vertical.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, RouterModule]
})
export class EventTimelineVerticalComponent {
  @Input()
  events: Event[] = [];
  tempEvents: Event[] = [];
  
 
  ngOnInit(){
    
    this.events.map((s, i) => {
      const minEvent = s.steps.map((x: { start: any; }) => x.start).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[0];
      const maxEvent = s.steps.map((x: { end: any; }) => x.end).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[s.steps.length - 1];
      const minDate = moment(new Date(minEvent));
      const maxDate = moment(new Date(maxEvent));



var event = {
  side: i % 2 === 0 ? 'left' : 'right',
  title: s.title,
  contentItemId: s.contentItemId,
  start: minEvent,
  group: 0,
  end: maxEvent,
  steps: [...s.steps]
}
      this.tempEvents.push(event as Event);
    });
   
  }
  convertToJalali(date: momentj.MomentInput | undefined) {
    return momentj(date).locale('fa').format('YYYY/MM/DD');// parse a gregorian (miladi) date
    
  }
}
