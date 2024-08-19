import { AfterViewInit, Component, ElementRef, Input, OnInit, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import {CompactType, DirTypes, GridType, GridsterComponent, GridsterConfig, GridsterItem, GridsterItemComponent, GridsterModule, GridsterPush} from 'angular-gridster2';
import { max } from 'lodash';
import * as momentj from 'jalali-moment';
import * as Moment from 'moment';
import { extendMoment } from 'moment-range';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { EventTimelineVerticalComponent } from '../event-timeline-vertical/event-timeline-vertical.component';
const moment = extendMoment(Moment);
@Component({
  selector: 'app-event-timeline-grid',
  templateUrl: './event-timeline-grid.component.html',
  styleUrls: ['./event-timeline-grid.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FlexLayoutModule, GridsterModule]
})
export class EventTimelineGridComponent implements OnInit, AfterViewInit{
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
  ngOnInit() {
  
    let totalSteps = [];
    this.events.map(x => {
     totalSteps = [...totalSteps, ...x.steps];
   });



    this.events.map(s => {
      const minEvent = s.steps.map(x => x.start).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[0];
      const maxEvent = s.steps.map(x => x.end).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[s.steps.length - 1];
      const minDate = moment(new Date(minEvent));
      const maxDate = moment(new Date(maxEvent));




      this.tempEvents.push({
        title: s.title,
        contentItemId: s.contentItemId,
        start: minEvent,
        group: 0,
        end: maxEvent,
        steps: [...s.steps]
      });
    });




    const minTotalEvent = this.tempEvents.map(x => x.start).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[0];
    const maxTotalEvent = this.tempEvents.map(x => x.end).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[this.tempEvents.length - 1];
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

    const sortedEvents = this.tempEvents.sort(function(a: any, b: any) { return new Date(a.start).valueOf() - new Date(b.start).valueOf(); });
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
        var totalDuration = Math.abs(momentj(momentj(momentj(s.end).format('jYYYY-jM') +'-'+ momentj(s.end).locale('fa').daysInMonth()).format('YYYY-MM-DD') ).diff(momentj(s.start).format('jYYYY-jM') + '-01', 'days'));
          var startPercent = this.percentage(Math.abs(momentj(momentj(s.start).format('jYYYY-jM') + '-01').diff(momentj(momentj(s.start).format('jYYYY-jM-jD')), 'days')), totalDuration);
          var endPercent = this.percentage(Math.abs(momentj(momentj(s.end).format('jYYYY-jM-jD') ).diff(momentj(momentj(s.end).format('jYYYY-jM')+ '-' + momentj(s.end).locale('fa').daysInMonth()), 'days')), totalDuration);
        if (i === 0 && this.dashboard.filter(xx => xx.label === s.title).length === 0) {
          this.dashboard.push(
          {
            cols: Array.from(moment.range(new Date(s.start), new Date(s.end)).by('month')).length,
            rows: 1,
            startPercent: startPercent.toFixed(0),
            endPercent: endPercent.toFixed(0),
            startDay: momentj(s.start).format('jD'),
            endDay: momentj(s.end).format('jD'),
            startDate: momentj(s.start).format('jYYYY-jM-jD'),
                    endDate: momentj(s.end).format('jYYYY-jM-jD'),
            label: s.title,
            contentItemId: s.contentItemId,
            steps: s.steps,
            color: '#D7792A',
            y: 2,
            x: month
          });
        }
        this.dashboard.map(x => {
          if (+momentj(new Date(s.start)).locale('fa').format('MM') === prevMonth &&
          s.title !== x.label) {
            if ( Array.from(moment.range(new Date(minTotalEvent), new Date(s.start)).by('month')).length <= (x.x + x.cols)) {
              if (this.dashboard.filter(xx => xx.label === s.title).length === 0){
                ind++;
                this.dashboard.push(
                  {
                    cols: Array.from(moment.range(new Date(s.start), new Date(s.end)).by('month')).length,
                    rows: 1,
                    startPercent: startPercent.toFixed(0),
                    endPercent: endPercent.toFixed(0),
                    startDay: momentj(s.start).format('jD'),
                    endDay: momentj(s.end).format('jD'),
                    startDate: momentj(s.start).format('jYYYY-jM-jD'),
                    endDate: momentj(s.end).format('jYYYY-jM-jD'),
                    label: s.title,
                    contentItemId: s.contentItemId,
                    steps: s.steps,
                    y: ind ,
                    color: ind % 2 === 0 ? '#D7792A' : '#5C5B5B',
                    x: month
                  });
              }
            } else  {
              if (this.dashboard.filter(xx => xx.label === s.title).length === 0){
                ind = 2;
                this.dashboard.push(
                  {
                    cols: Array.from(moment.range(new Date(s.start), new Date(s.end)).by('month')).length,
                    rows: 1,
                    startPercent: startPercent.toFixed(0),
                    endPercent: endPercent.toFixed(0),
                    startDay: momentj(s.start).format('jD'),
                    endDay: momentj(s.end).format('jD'),
                    startDate: momentj(s.start).format('jYYYY-jM-jD'),
                    endDate: momentj(s.end).format('jYYYY-jM-jD'),
                    label: s.title,
                    contentItemId: s.contentItemId,
                    steps: s.steps,
                    color: ind % 2 === 0 ? '#D7792A' : '#5C5B5B',
                    y: 2,
                    x: month
                  });
              }

            }

      }
        });

        });

    }
    this.dashboard = [... this.dashboard, ...this.yearAndMonth];

    
    
    this.options = {
      gridType: GridType.HorizontalFixed ,
      compactType: CompactType.None,
      fixedRowHeight: 74.88,
      fixedColWidth: 134.08,
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
     percentage(partialValue, totalValue) {
      return (100 * partialValue) / totalValue;
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
      const minEvent = eventItem.steps.map(x => x.start).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[0];
      const maxEvent = eventItem.steps.map(x => x.end).sort(function(a: any, b: any) { return new Date(a).valueOf() - new Date(b).valueOf(); })[eventItem.steps.length - 1];
      const minDate = moment(new Date(minEvent));
      const maxDate = moment(new Date(maxEvent));
      const duration = maxDate.diff(minDate, 'days');
      const steps = [];
      for (let i = 0; i <= duration; i++) {
        const item = eventItem.steps.map(x => x).filter(x => moment(new Date(x.start)).diff(minDate, 'days') === i );
        if (item.length > 0) {
          steps.push(item);
        } else {
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
