import { Component, OnInit, forwardRef, Input, Output, EventEmitter, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormBuilder, Form, FormGroup, FormControl } from '@angular/forms';
import { BrandCollectionService } from 'src/app/services/brand-collection.service';
import { AuthService } from 'src/app/services/auth.service';
import { EventCategoriesListDatabase } from 'src/app/services/event-categories-list-database';
import { EventCategory } from 'src/app/models/event-category';
import { EventService } from 'src/app/services/event.service';

@Component({
  selector: 'app-event-categories',
  templateUrl: './event-categories.component.html',
  styleUrls: ['./event-categories.component.css'],
  providers: [EventCategoriesListDatabase,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => EventCategoriesComponent),
      multi: true
    }]
})
export class EventCategoriesComponent implements OnInit, AfterViewInit {
  eventCategoriesForm: FormGroup;
  eventCategoriesList: EventCategory[] = [];
  @Input() selectedIdList: EventCategory[] = [];
  @Output() EventCategoryChange: EventEmitter<any> = new EventEmitter<any>();
  constructor(private database: EventCategoriesListDatabase,
              public fb: FormBuilder,
              private eventService: EventService,
              private cdRef: ChangeDetectorRef,
              private authService: AuthService) {
              }

  toFormGroup(collections: EventCategory[] ) {
    let group: any = {};

    collections.forEach(coll => {
      group[coll.categoryId] = new FormControl(false);
    });
    return new FormGroup(group);
  }
  ngOnInit() {
    this.database.dataChange.subscribe(data => {
      this.eventCategoriesList = data;
      this.eventCategoriesForm = this.toFormGroup(this.eventCategoriesList);
    });
  }
  ngAfterViewInit() {
    this.cdRef.detectChanges();
  }


  writeValue(value: EventCategory[]) {
    if (value != null && value) {

      this.selectedIdList = value;
      // if (this.selectedIdList && this.selectedIdList.length > 0 ) {
      //   const diff = this.checklistSelection.selected.map(x => x.id)
      //    .filter(x => !this.selectedIdList.map(z => z.categoryId).includes(x));
      //   this.selectedIdList.map(y => {
      //     const catFlat = this.treeControl.dataNodes.filter(x => x.id === y.categoryId)[0];
      //     if (catFlat.expandable) {
      //       this.checklistSelection.select(catFlat);
      //       const descendants = this.treeControl.getDescendants(catFlat);
      //       this.checklistSelection.select(...descendants);
      //             } else {
      //               this.checklistSelection.select(catFlat);
      //     }
      //   });
      //   diff.map(y => {
      //     const catFlat = this.treeControl.dataNodes.filter(x => x.id === y)[0];
      //     if (catFlat.expandable) {
      //       this.checklistSelection.deselect(catFlat);
      //       const descendants = this.treeControl.getDescendants(catFlat);
      //       this.checklistSelection.deselect(...descendants);
      //     } else {
      //       this.checklistSelection.deselect(catFlat);
      //     }
      //   });
      // }
    }
  }
  propagateChange = (_: any) => {};

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }
  registerOnTouched(fn: any): void {
  }
  setDisabledState?(isDisabled: boolean): void {
  }

  selectNodes(event, id: EventCategory) {
    if (event.checked) {
      this.selectedIdList.push(id);
    } else {
      const index = this.selectedIdList.indexOf(id);
      if (index !== -1) {
        this.selectedIdList.splice(index, 1);
      }
    }
    this.propagateChange(this.selectedIdList);
    const selectedEventCategories: EventCategory[] = [];
    this.EventCategoryChange.emit(this.selectedIdList);
  }
}
