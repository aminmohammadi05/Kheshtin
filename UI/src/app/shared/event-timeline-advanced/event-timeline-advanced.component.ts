import { AfterViewInit, Component, Input, OnInit, QueryList, ViewChildren, ViewEncapsulation } from '@angular/core';
import { log } from 'console';
import * as moment from 'jalali-moment';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
@Component({
  selector: 'app-event-timeline-advanced',
  templateUrl: './event-timeline-advanced.component.html',
  styleUrls: ['./event-timeline-advanced.component.scss']
})
export class EventTimelineAdvancedComponent implements OnInit, AfterViewInit {
  @Input() hasYears: any;
  @Input() hasMonths: any;
  @Input() hasDays: any;
  @Input() recentEvents: Observable<any[]>;
  @Input() days:any[];
  @Input() events : any[];
  @Input() options: any ;
  
  @ViewChildren('dayElement') daysElements: QueryList<any>;
  @ViewChildren('headerDayElement') headerDaysElements: QueryList<any>;
  @ViewChildren('monthElement') monthsElements: QueryList<any>;
  @ViewChildren('yearElement') yearsElements: QueryList<any>;
  myStyle: SafeHtml;
  headerData: any[] = [];
  colors= ['#b03532',
    '#33a8a5',
    '#30997a',
    '#6a478f',
    '#da6f2b',
    '#3d8bb1',
    '#e03f3f',
    '#59a627',
    '#4464a1',]
    months ={
      1 : {id: 1, name:'فروردین'},
      2 : {id: 2, name:'اردیبهشت'},
      3 : {id: 3, name:'خرداد'},
      4 : {id: 4, name:'تیر'},
      5 : {id: 5, name:'مرداد'},
      6 : {id: 6, name:'شهریور'},
      7 : {id: 7, name:'مهر'},
      8 : {id: 8, name:'آبان'},
      9 : {id: 9, name:'آذر'},
      10 : {id: 10, name:'دی'},
      11 : {id: 11, name:'بهمن'},
      12 : {id: 12, name:'اسفند'}
      }
      totalDays = [];
      totalMonths = [];
      totalYears = [];
  constructor(private _sanitizer: DomSanitizer) {

  }
  ngOnInit(): void {
   // console.log(this.events)
    this.days = this.days.sort(function(a: any, b:any) { return new Date(a.date).valueOf() - new Date(b.date).valueOf() })
    // var totalSteps = []
    //  this.events.map(x => {
    //   totalSteps = [...totalSteps, ...x.steps]
    // });
  
    
       var minEvent = this.events.sort(function(a: any, b:any) { return new Date(a.start).valueOf() - new Date(b.start).valueOf() })[0];
      var maxEvent = this.events.sort(function(a: any, b:any) { return new Date(a.start).valueOf() - new Date(b.start).valueOf() })[this.events.length -1];
      const minDate = moment(new Date(minEvent.start))
      const maxDate = moment(new Date(maxEvent.end))
      const duration = maxDate.diff(minDate, 'days');
      

        for (let j = 0; j <= duration; j++){ 
          const newYear = moment(new Date(minEvent.start)).add(j, 'd').locale('fa').format('YYYY'); 
          const newMonth = moment(new Date(minEvent.start)).add(j, 'd').locale('fa').format('MM');
          const newDay = moment(new Date(minEvent.start)).add(j, 'd').locale('fa').format('DD');
       
        
          if(this.headerData.filter(x => x.year === newYear).length === 0) {
            this.headerData.push({year: newYear, months: [{month: this.months[+newMonth], days: [{day: newDay}]}]})
          }
          else{
            if(!this.headerData.filter(x => x.year === newYear)[0].months.map(x => x.month).includes(this.months[+newMonth])){ 
              this.headerData.filter(x => x.year === newYear)[0].months.push({month: this.months[+newMonth], days: [{day: newDay}]})             
            } else{
              if(!this.headerData.filter(x => x.year === newYear)[0].months.filter(x => x.month === this.months[+newMonth])[0].days.map(x => x.day).includes(newDay)){
                this.headerData.filter(x => x.year === newYear)[0].months.filter(x => x.month === this.months[+newMonth])[0].days.push({day: newDay})
              }
             
            }
          }
        }
  }
  ngAfterViewInit() {
    
 
  }
  getDay(day) {
    const d = this.days.map(x => moment(new Date(x.date)).locale('fa').format('YYYY-MM-DD')).filter(x => x === day);
     return d.length > 0 ? d[0].split('-')[2] : '';
  }
setEventStyle(event) {
  
  if( this.headerDaysElements && this.headerDaysElements.toArray().length > 0){
    // console.log(this.headerDaysElements.toArray().map(x => x.nativeElement));
    
    const startDay = this.days.filter( x => x.date === event.start )[0];
   
    
    const endDay = this.days.filter( x => x.date === event.end)[0];
    
    const startLeft = this.headerDaysElements.toArray() && this.headerDaysElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(startDay.date)).locale('fa').format('YYYY-MM-DD')).length > 0? this.headerDaysElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(startDay.date)).locale('fa').format('YYYY-MM-DD'))[0].nativeElement.parentElement.parentElement.parentElement.offsetLeft : 0;
    var startWidth = this.headerDaysElements.toArray() && this.headerDaysElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(startDay.date)).locale('fa').format('YYYY-MM-DD')).length > 0?this.headerDaysElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(startDay.date)).locale('fa').format('YYYY-MM-DD'))[0].nativeElement.offsetWidth : 0;
    const endLeft = this.headerDaysElements.toArray() && this.headerDaysElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(endDay.date)).locale('fa').format('YYYY-MM-DD')).length > 0 ?this.headerDaysElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(endDay.date)).locale('fa').format('YYYY-MM-DD'))[0].nativeElement.parentElement.parentElement.parentElement.offsetLeft : 0;
    const endWidth = this.headerDaysElements.toArray() && this.headerDaysElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(endDay.date)).locale('fa').format('YYYY-MM-DD')).length > 0 ?this.headerDaysElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(endDay.date)).locale('fa').format('YYYY-MM-DD'))[0].nativeElement.offsetWidth : 0;
   // console.log(startDay.date, endDay.date)
    event.details = this._sanitizer.bypassSecurityTrustHtml(`<div style="background-color: #D7792A">${event.title}</div>`); //${this.generateSteps(event, startWidth)}</div>`);
    var d = moment(new Date(startDay.date)).locale('fa').diff(moment(this.headerDaysElements.toArray()[0].nativeElement.getAttribute('title').toString(), 'jYYYY/jM/jD'), 'day'); 
    console.log(startWidth);
 
    return {'list-style-type': 'none', 'left': startLeft +(d * startWidth) +'px', 'width': ((startLeft + (startWidth * (moment(new Date(endDay.date)).locale('fa').diff(moment(new Date(startDay.date)).locale('fa'), 'day') + 1)) ) ) +'px', 'color': 'black', 'opacity': '1',  'direction': 'rtl'};
  }
  // else if(this.monthsElements && this.monthsElements.length > 0 && this.monthsElements.toArray().length > 0) {
  //   const startDay = this.days.filter( x => x.date === event.start )[0];
  //   const endDay = this.days.filter( x => x.date === event.end)[0];
  //   const startLeft = this.monthsElements.toArray() && this.monthsElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(startDay.date)).locale('fa').format('YYYY-MM')).length > 0? this.monthsElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(startDay.date)).locale('fa').format('YYYY-MM'))[0].nativeElement.parentElement.offsetLeft : 0;
  //   const startWidth = this.monthsElements.toArray() && this.monthsElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(startDay.date)).locale('fa').format('YYYY-MM')).length > 0?this.monthsElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(startDay.date)).locale('fa').format('YYYY-MM'))[0].nativeElement.offsetWidth : 0;
  //   const endLeft = this.monthsElements.toArray() && this.monthsElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(endDay.date)).locale('fa').format('YYYY-MM')).length > 0 ?this.monthsElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(endDay.date)).locale('fa').format('YYYY-MM'))[0].nativeElement.parentElement.offsetLeft : 0;
  //   const endWidth = this.monthsElements.toArray() && this.monthsElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(endDay.date)).locale('fa').format('YYYY-MM')).length > 0 ?this.monthsElements.toArray().filter(x => x.nativeElement.getAttribute('title').toString() === moment(new Date(endDay.date)).locale('fa').format('YYYY-MM'))[0].nativeElement.offsetWidth : 0;
   
  //   var d = moment(new Date(startDay.date)).locale('fa').diff(moment(this.monthsElements.toArray()[0].nativeElement.getAttribute('title').toString(), 'jYYYY/jM'), 'month'); 
   
    
  //  return {'list-style-type': 'none', 'left': startLeft +(d * startWidth) +'px', 'width': ((startLeft + (startWidth * (moment(new Date(endDay.date)).locale('fa').diff(moment(new Date(startDay.date)).locale('fa'), 'month') + 1)) ) ) +'px', 'color': 'black', 'opacity': '1', 'background-color': this.getColor(), 'direction': 'rtl'};

  // }
 }
 generateSteps(event, startWidth){
  
  
  var c = `<div class="chart-wrapper"><ul class="chart-values"><li style="list-style-type: none;">${event.title}</li>`;
  event.steps.map((x) => {
   if(moment(new Date(x.start)).locale('fa').isValid()){
    const d = moment(new Date(x.start)).locale('fa').format('YYYY-MM-DD').split('-')[2];
    var el = this.headerDaysElements.toArray().filter(x => x.nativeElement.innerHTML === d)[0];
    var ind = this.headerDaysElements.toArray().indexOf(el)
     c = c + `<li style="list-style-type: none;left: ${ind * startWidth}px">${moment(new Date(x.start)).locale('fa').format('YYYY-MM-DD')}</li>`
   }
  })
c = c + '</ul></div>'
return c;
 }
 getColor(){ 
   return "hsl(" + 360 * Math.random() + ',' +
              (25 + 70 * Math.random()) + '%,' + 
              (70 + 10 * Math.random()) + '%)'
 }
}
