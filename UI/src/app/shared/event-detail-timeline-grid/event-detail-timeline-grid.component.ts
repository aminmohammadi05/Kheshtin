import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import {CompactType, DirTypes, GridType, GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterPush} from 'angular-gridster2';
import { max } from 'lodash';
import * as momentj from 'jalali-moment';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
const moment = extendMoment(Moment);
@Component({
  selector: 'app-event-detail-timeline-grid',
  templateUrl: './event-detail-timeline-grid.component.html',
  styleUrls: ['./event-detail-timeline-grid.component.scss']
})
export class EventDetailTimelineGridComponent implements OnInit, AfterViewInit{
  topVar = 0;
  options: GridsterConfig;
  dashboard: Array<GridsterItem>;
  itemToPush: GridsterItemComponent;
  tempEvents = [];
  groups = [];
  columns = [];
  yearAndMonth = [];
  @Input() events: any[];
  @ViewChildren('monthElement') monthsElements: QueryList<any>;
  @ViewChildren('yearElement') yearsElements: QueryList<any>;
  @ViewChild('widgetsContent', { read: ElementRef }) public widgetsContent: ElementRef<any>;
  headerData: any[] = [];
  months = {
    1 : {id: 1, name: 'فروردین'},
    2 : {id: 2, name: 'اردیبهشت'},
    3 : {id: 3, name: 'خرداد'},
    4 : {id: 4, name: 'تیر'},
    5 : {id: 5, name: 'مرداد'},
    6 : {id: 6, name: 'شهریور'},
    7 : {id: 7, name: 'مهر'},
    8 : {id: 8, name: 'آبان'},
    9 : {id: 9, name: 'آذر'},
    10 : {id: 10, name: 'دی'},
    11 : {id: 11, name: 'بهمن'},
    12 : {id: 12, name: 'اسفند'}
    };

    constructor(private renderer: Renderer2){

    }
    percentage(partialValue, totalValue) {
      return (100 * partialValue) / totalValue;
   }
  ngOnInit() {

    
    

    const minTotalEvent = this.events.map(x => x.start).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[0];
    const maxTotalEvent = this.events.map(x => x.end).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[this.events.length - 1];
    const duration = momentj(new Date(maxTotalEvent)).diff(momentj(new Date(minTotalEvent)), 'days');

    

    for (let j = 0; j <= duration; j++) {
      const newYear = momentj(new Date(minTotalEvent)).add(j, 'd').locale('fa').format('YYYY');
      const newMonth = momentj(new Date(minTotalEvent)).add(j, 'd').locale('fa').format('MM');
      const newDay = momentj(new Date(minTotalEvent)).add(j, 'd').locale('fa').format('DD');

      if (this.headerData.filter(x => x.year === newYear).length === 0) {
        this.headerData.push({year: newYear, months: [{month: this.months[+newMonth], days: [{day: newDay}]}]});
      }
      else{
        if (!this.headerData.filter(x => x.year === newYear)[0].months.map(x => x.month).includes(this.months[+newMonth])){
          this.headerData.filter(x => x.year === newYear)[0].months.push({month: this.months[+newMonth], days: [{day: newDay}]});
        } else {
          if (!this.headerData.filter(x => x.year === newYear)[0].months.filter(x => x.month === this.months[+newMonth])[0].days.map(x => x.day).includes(newDay)){
            this.headerData.filter(x => x.year === newYear)[0].months.filter(x => x.month === this.months[+newMonth])[0].days.push({day: newDay});
          }

        }
      }
    }


    const range = moment.range(new Date(minTotalEvent), moment(new Date(maxTotalEvent)));
    const startDate = new Date(minTotalEvent);


    this.columns = Array.from(range.by('month')).map(x => momentj(x.format('YYYY-MM-DD')).locale('fa').format('YYYY-MM'));

    const sortedEvents = this.events.sort(function(a: any, b: any) { return new Date(a.start).valueOf() - new Date(b.start).valueOf(); });
    this.dashboard = [];
    this.yearAndMonth = [];
    let ind = 2;
    let month = -1;
    let prevMonth = 0;
    let prevYear = 0;
    
    
    for (let j = 0; j <= duration; j++) {
      
      const newYear = momentj(new Date(minTotalEvent)).add(j, 'd').locale('fa').format('YYYY');
      const newMonth = momentj(new Date(minTotalEvent)).add(j, 'd').locale('fa').format('MM');
      const newDay = momentj(new Date(minTotalEvent)).add(j, 'd').locale('fa').format('DD');
      
      if (prevMonth !== +newMonth) {
        month++;
        
        
        prevMonth = +newMonth;
        if (this.yearAndMonth.filter(xx => xx.x === month && xx.label === this.months[+newMonth]).length === 0) {
          this.yearAndMonth.push(
          {
            cols: 1,
            rows: 1,
            label: this.months[+newMonth].name,
            color: '#D7792A',
            y: 1,
            x: month
          });
        }
        if (prevYear !== +newYear) {
          prevYear = +newYear;
          if ( this.yearAndMonth.filter(xx => xx.label === newYear).length === 0) {
            this.yearAndMonth.push(
            {
              cols: 1,
              rows: 1,
              label: newYear,
              color: '#D7792A',
              y: 0,
              x: month
            });
          }
        }
      }
   
      
      sortedEvents.map((s, i) => {
        
        
        if ( this.dashboard.filter(xx => xx.label === s.title).length === 0) {
       
        
          var totalDuration = Math.abs(momentj(momentj(momentj(s.end).format('jYYYY-jM') +'-'+ momentj(s.end).locale('fa').daysInMonth()).format('YYYY-MM-DD') ).diff(momentj(s.start).format('jYYYY-jM') + '-01', 'days'));
          var startPercent = this.percentage(Math.abs(momentj(momentj(s.start).format('jYYYY-jM') + '-01').diff(momentj(momentj(s.start).format('jYYYY-jM-jD')), 'days')), totalDuration);
          var endPercent = this.percentage(Math.abs(momentj(momentj(s.end).format('jYYYY-jM-jD') ).diff(momentj(momentj(s.end).format('jYYYY-jM')+ '-' + momentj(s.end).locale('fa').daysInMonth()), 'days')), totalDuration);
         // console.log(momentj(s.start).locale('fa').format('YYYY-MM-DD'), momentj(s.end).locale('fa').format('YYYY-MM-DD'))
        // console.log(momentj(s.start).locale('fa').format('YYYY-MM-DD'), momentj(s.start).startOf('month').locale('fa').format('YYYY-MM-DD'), Array.from(moment.range(moment(s.start), moment(s.start).startOf('month')).by('day')).length);
       
       
        
          
          this.dashboard.push(
          {
            cols: Array.from(moment.range(new Date(s.start), new Date(s.end)).by('month')).length,
            detailedCols: Array.from(moment.range(new Date(s.start), new Date(s.end)).by('day')).length,
            startPercent: startPercent.toFixed(0),
            endPercent: endPercent.toFixed(0),
            startDay: momentj(s.start).format('jD'),
            endDay: momentj(s.end).format('jD'),
            rows: 1,
            label: s.title,
            contentItemId: s.contentItemId,
            start: s.start,
            end: s.end,
            color: '#D7792A',
            y: 2 + i,
            x: momentj(momentj(s.start).format('jYYYY-jM-jD')).diff(momentj(minTotalEvent).format('jYYYY-jM-jD'), 'months')
          });
        }
        

        });

    }
    this.dashboard = [... this.dashboard, ...this.yearAndMonth];
   
    
    this.options = {
      gridType: GridType.HorizontalFixed ,
      compactType: CompactType.None,
      fixedRowHeight: 74.88,
      fixedColWidth: 334.08,
      minCols: 6,
      margin: 0,
      // maxCols: 6,
      pushItems: false,
      outerMargin: false,
      // displayGrid: 'always',
      draggable: {
        enabled: false
      },
      resizable: {
        enabled: false
      },

      dirType: DirTypes.RTL
    };

    
    
     }
     ngAfterViewInit() {
      
      this.topVar = (this.widgetsContent.nativeElement.offsetHeight / (this.events.length + 2)) + 20;
      
     
     }
     

  public scrollRight(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft + 150), behavior: 'smooth' });
  }

  public scrollLeft(): void {
    this.widgetsContent.nativeElement.scrollTo({ left: (this.widgetsContent.nativeElement.scrollLeft - 150), behavior: 'smooth' });
  }

  existsInGroups(t){
    let result = false;
    this.groups.map(g => {
  g.map(i => {
    if (i === t) {
      result = true;
    }
  });
});
    return result;
  }
  getEventDuration(eventItem) {
    
    if (eventItem.y > 1) {
      
      const minEvent = eventItem.start;
      const maxEvent = eventItem.end;
      const minDate = moment(new Date(minEvent));
      const maxDate = moment(new Date(maxEvent));
      const duration = maxDate.diff(minDate, 'days');
      const steps = [];
      for (let i = 0; i <= duration; i++) {
        if(moment(new Date(eventItem.start)).diff(minDate, 'days') === i){
          const item = eventItem;
          steps.push(item);
          
        }
        else{
          steps.push({});
        }
        
      }
      return steps;
    }
  }
  removeItem($event, item) {
    $event.preventDefault();
    $event.stopPropagation();
    this.dashboard.splice(this.dashboard.indexOf(item), 1);
  }

  addItem() {
    this.dashboard.push({x: 0, y: 0, cols: 1, rows: 1});
  }


  initItem(item: GridsterItem, itemComponent: GridsterItemComponent) {
    this.itemToPush = itemComponent;
  }

  pushItem() {
    const push = new GridsterPush(this.itemToPush); // init the service
    this.itemToPush.$item.rows += 4; // move/resize your item
    if (push.pushItems(push.fromNorth)) { // push items from a direction
      push.checkPushBack(); // check for items can restore to original position
      push.setPushedItems(); // save the items pushed
      this.itemToPush.setSize();
      this.itemToPush.checkItemChanges(this.itemToPush.$item, this.itemToPush.item);
    } else {
      this.itemToPush.$item.rows -= 4;
      push.restoreItems(); // restore to initial state the pushed items
    }
    push.destroy(); // destroy push instance
    // similar for GridsterPushResize and GridsterSwap
  }
}
