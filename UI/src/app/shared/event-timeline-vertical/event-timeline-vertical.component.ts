import { Component, Input } from '@angular/core';
import * as momentj from 'jalali-moment';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { Observable, Subscription } from 'rxjs';
const moment = extendMoment(Moment);
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-event-timeline-vertical',
  templateUrl: './event-timeline-vertical.component.html',
  styleUrls: ['./event-timeline-vertical.component.scss']
})
export class EventTimelineVerticalComponent {
  @Input() events: any[];
  tempEvents = [];
  
 
  ngOnInit(){
    
    this.events.map((s, i) => {
      const minEvent = s.steps.map(x => x.start).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[0];
      const maxEvent = s.steps.map(x => x.end).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[s.steps.length - 1];
      const minDate = moment(new Date(minEvent));
      const maxDate = moment(new Date(maxEvent));




      this.tempEvents.push({
        side: i % 2 === 0 ? 'left' : 'right',
        title: s.title,
        contentItemId: s.contentItemId,
        start: minEvent,
        group: 0,
        end: maxEvent,
        steps: [...s.steps]
      });
    });
   
  }
  convertToJalali(date) {
    return momentj(date).locale('fa').format('YYYY/MM/DD');// parse a gregorian (miladi) date
    
  }
}
