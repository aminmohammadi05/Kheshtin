import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList, Directive } from '@angular/core';

import * as moment from 'jalali-moment';
import { Observable } from 'rxjs';
import _ from 'lodash'
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventTimelineGridComponent } from '../../../shared/event-timeline-grid/event-timeline-grid.component';
import { EventTimelineVerticalComponent } from '../../../shared/event-timeline-vertical/event-timeline-vertical.component';
import { Event } from '../../../models/query-home-event/event';
import { EventStep } from '../../../models/query-home-event/event-step';
import { EventDays } from '../../../models/query-home-event/event-days';



@Component({
  selector: 'app-home-event-timeline',
  templateUrl: './home-event-timeline.component.html',
  styleUrls: ['./home-event-timeline.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, EventTimelineGridComponent, EventTimelineVerticalComponent]
})
export class HomeEventTimelineComponent implements OnInit {
  @Input()
  recentEvents!: Observable<any[]>;
  @ViewChild('nav')
  slider!: ElementRef;
  options = {fomat: 'month'};

  isMobile!: boolean;
headerYears = [];
headerMonths = [];
headerDays = [];
public events: Event[] = [];
public days: EventDays[] = [];
  constructor( ) {
    // this.mediaObserver.asObservable().subscribe(() => {
    //   this.isMobile = this.mediaMatcher.matchMedia('(max-width: 900px)').matches;
    // });
  }

  ngOnInit() {
    
    this.recentEvents.subscribe((e: any) => {
      
      e.event.map((et: { contentItemId: any; displayText: any; bag: { contentItems: any[]; }; }, ind: number) => {
        const parent = {
          width: 100,
          left: ind * 100,
          color: 'red',
          opacity: 1,
          contentItemId : et.contentItemId,
          // start: et.stepDate,
          // end: eventTemp[eventTemp.length -1].stepEndDate, 
          title: et.displayText,
          steps: []
        } as unknown as Event;
        
        var eventTemp = et.bag.contentItems.filter((x: { __typename: string; }) => x.__typename === 'EventStep'); 
        eventTemp.map((et: { stepDate: any; eventIcon: { contentItems: { iconTitle: any; }[]; }; userTitle: any; }, ind: number) => {
          var eventStep = {
            width: 100,
            left: ind * 100,
            color: 'red',
            opacity: 1,
            start: et.stepDate,
            icon: et.eventIcon.contentItems[0].iconTitle,            
            end: eventTemp[eventTemp.length -1].stepEndDate, 
            title: et.userTitle
          };
          parent.steps.push(eventStep as EventStep);
        })
        this.events.push(parent);
        // this.events.push({
        //   width: 100,
        //   left: ind * 100,
        //   color: 'red',
        //   opacity: 1,
        //   start: eventTemp[0].stepDate,
        //   end: eventTemp[eventTemp.length -1].stepEndDate, 
        //   title: et.displayText
        // });
      })
      
      this.events.map(y => {
        y.steps.map((z: { start: any; end: any; }) => {
          if(!this.days.map(x => x.date).includes(z.start))
          {
            this.days.push({
              offsetLeft : 0,
              offsetWidth : 150,
              date: z.start,
              left: 0,
              width: 0,
              backgroundColor : '',
              opacity : 1
            })
          }
          if(!this.days.map(x => x.date).includes(z.end))
          {
            this.days.push({
              offsetLeft : 0,
              offsetWidth : 150,
              date: z.end,
              left: 0,
              width: 0,
              backgroundColor : '',
              opacity : 1
            })
          }
        })
        
        
      })
        
      
      
      
        
     
      
    })
    
 
  }
  ngAfterViewInit() {
    
    // 
  }
  
 
  
  // public getRemainingTime(e: any) {
    
   
  //   var current = moment().startOf('day');
  //   var remainingTime = '';  
   
  //   for(let step of e.bag.contentItems.filter(x => x.__typename === 'EventStep')) {
    
  //     var duration =  moment(step.stepDate).locale('fa').diff(moment(current).locale('fa'), 'days');
    
  //     if(Math.round(duration) > 0) {   
       
  //       remainingTime =  `${Math.round( duration)}روز مانده به ${step.userTitle}`;
  //       break;
  //     }
  //   }
  //   return remainingTime ? remainingTime : "اتمام مهلت";
  
    
  
  // }

 
}
