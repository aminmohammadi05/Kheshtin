import { Component, OnInit, Input, ViewChild, ElementRef, ViewChildren, QueryList, Directive } from '@angular/core';
import { AppService } from 'src/app/app.service';
import * as moment from 'jalali-moment';
import { Observable } from 'rxjs';
import _ from 'lodash'
import { FlexLayoutModule, MediaObserver } from '@angular/flex-layout';
import { MediaMatcher } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BlogItemHomeComponent } from 'src/app/shared/blog-item-home/blog-item-home.component';
import { EventTimelineGridComponent } from 'src/app/shared/event-timeline-grid/event-timeline-grid.component';
import { EventTimelineVerticalComponent } from 'src/app/shared/event-timeline-vertical/event-timeline-vertical.component';



@Component({
  selector: 'app-home-event-timeline',
  templateUrl: './home-event-timeline.component.html',
  styleUrls: ['./home-event-timeline.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FlexLayoutModule, EventTimelineGridComponent, EventTimelineVerticalComponent]
})
export class HomeEventTimelineComponent implements OnInit {
  @Input() recentEvents: Observable<any[]>;
  @ViewChild('nav') slider: ElementRef;
  options = {fomat: 'month'};

  isMobile: boolean;
headerYears = [];
headerMonths = [];
headerDays = [];
public events = [];
public days = [];
  constructor(public appService:AppService, public  mediaObserver: MediaObserver, private mediaMatcher: MediaMatcher,) {
    this.mediaObserver.asObservable().subscribe(() => {
      this.isMobile = this.mediaMatcher.matchMedia('(max-width: 900px)').matches;
    });
  }

  ngOnInit() {
    
    this.recentEvents.subscribe((e: any) => {
      
      e.event.map((et, ind) => {
        var parent = {
          width: 100,
          left: ind * 100,
          color: 'red',
          opacity: 1,
          contentItemId : et.contentItemId,
          // start: et.stepDate,
          // end: eventTemp[eventTemp.length -1].stepEndDate, 
          title: et.displayText,
          steps: []
        };
        var eventTemp = et.bag.contentItems.filter(x => x.__typename === 'EventStep'); 
        eventTemp.map((et, ind) => {
          parent.steps.push({
            width: 100,
            left: ind * 100,
            color: 'red',
            opacity: 1,
            start: et.stepDate,
            icon: et.eventIcon.contentItems[0].iconTitle,            
            end: eventTemp[eventTemp.length -1].stepEndDate, 
            title: et.userTitle
          });
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
        y.steps.map(z => {
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
