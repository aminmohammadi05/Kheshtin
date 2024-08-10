import { Component, Input, QueryList, ViewChildren } from '@angular/core';
import { start } from 'repl';

@Component({
  selector: 'app-event-timeline',
  templateUrl: './event-timeline.component.html',
  styleUrls: ['./event-timeline.component.scss']
})
export class EventTimelineComponent {
  @Input() recentEvents: any[];
  @Input() days: any[];
  @Input() headerYears: any[];
  @Input() headerMonths: any[];
  @Input() headerDays: any[];
  @ViewChildren('dayElement') daysElements: QueryList<any>;
  colors= ['#b03532',
    '#33a8a5',
    '#30997a',
    '#6a478f',
    '#da6f2b',
    '#3d8bb1',
    '#e03f3f',
    '#59a627',
    '#4464a1',]

ngOnInit(){
    
}
setEventStyle(event) {
 if(this.daysElements.toArray().length > 0){

   const startDay = this.days.filter( x => x.date === event.start)[0];
   const endDay = this.days.filter( x => x.date === event.end)[0];
   const startInd = this.days.indexOf(startDay);
   const endInd = this.days.indexOf(endDay);
   const startLeft = this.daysElements.toArray() ? this.daysElements.toArray()[startInd].nativeElement.offsetLeft : 0;
   const startWidth = this.daysElements.toArray() ?this.daysElements.toArray()[startInd].nativeElement.offsetWidth : 0;
   const endLeft = this.daysElements.toArray() ?this.daysElements.toArray()[endInd].nativeElement.offsetLeft : 0;
   const endWidth = this.daysElements.toArray() ?this.daysElements.toArray()[endInd].nativeElement.offsetWidth : 0;
   
   
   
  return {'list-style-type': 'none', 'left': startLeft +'px', 'width': ((endLeft + endWidth) - (startLeft )) +'px', 'color': 'black', 'opacity': '1', 'background-color': this.getColor(), 'direction': 'rtl'};
 }else {
  return {}
 }
}
getColor(){ 
  return "hsl(" + 360 * Math.random() + ',' +
             (25 + 70 * Math.random()) + '%,' + 
             (70 + 10 * Math.random()) + '%)'
}
}
