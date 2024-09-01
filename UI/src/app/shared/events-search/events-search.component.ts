import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { GetInTouchComponent } from '../get-in-touch/get-in-touch.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { EventCategory } from '../../models/event-category';
import { EventSearch } from '../../models/event-search';
import { AuthService } from '../../services/auth.service';
import { BasicDataService } from '../../services/basic-data.service';

@Component({
  selector: 'app-events-search',
  templateUrl: './events-search.component.html',
  styleUrls: ['./events-search.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
})
export class EventsSearchComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input()
  removedSearchField!: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  categories!: BehaviorSubject<EventCategory[]>;
  public searchInput: FormControl = new FormControl('');
  public selectedCategories: any[] = [];
  public showMore = false;
  public verticalForm!: FormGroup;
  public eventCategories!: EventCategory[];
  public searchFields = new EventSearch({
    searchId: 1,
    categories: [],
    searchBox: ''
  });




  constructor(private authService: AuthService,
              private basicDataService: BasicDataService,
              public fb: FormBuilder,
              private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.basicDataService.getEventCategories().subscribe(x => {
      this.eventCategories = x.eventType.map((x1: { id: any; displayText: any; }) => ({
       categoryId: x1.id,
       name: x1.displayText,
      
      } as EventCategory));
      this.categories.next(this.eventCategories)
     })
    if (this.vertical) {
      this.verticalForm = this.fb.group({
        searchBox: null,
        categories: null
      });
      this.showMore = true;
    }

    

   // this.SearchChange.emit(this.verticalForm);
  }

 


  ngOnChanges() {
   
    
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
        // this.verticalForm.controls[arr[0]]['controls'][arr[1]].reset();
      } else if (this.removedSearchField.indexOf(',') > -1) {
        
        const arr = this.removedSearchField.split(',');
        this.selectedCategories = this.selectedCategories.filter(x => x.categoryId !== +arr[1]);
        this.searchFields.categories = this.selectedCategories;
        // this.store.dispatch(new SaveEventSearchForRequest(this.searchFields));
        // this.verticalForm.get('categories').setValue(this.selectedCategories);
        this.SearchChange.emit(this.verticalForm);
      }
      else if(this.removedSearchField === "hashtagObject") {
        this.SearchChange.emit(this.verticalForm);
      }
      else {
        this.verticalForm.controls[this.removedSearchField].reset();
      }
    }
  }

  public reset() {
    this.verticalForm.reset({
      fileType: null,
      searchBox: this.searchInput,
      categories: null,
      brandsBox: null
    });
  }

  public search() {
    this.SearchClick.emit();
  }



  public getAppearance() {
    return (this.variant !== 3) ? 'outline' : '';
  }
  public getFloatLabel() {
    return (this.variant === 1) ? 'always' : '';
  }
  ngAfterViewInit() {

    // this.eventCategories = this.store.select(getAllEventCategories);
    this.cdr.detectChanges();
    this.searchInput.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.SearchChange.emit(this.verticalForm);
        })
    )
    .subscribe();
  }
  public categoryChanged(event: { value: any; }) {
       
    if (event) {
      this.selectedCategories = [...event.value];
      this.searchFields.categories = this.selectedCategories;
      // this.store.dispatch(new SaveEventSearchForRequest(this.searchFields));
      this.SearchChange.emit(this.verticalForm);
    }
  }
}
