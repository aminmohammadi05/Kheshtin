import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ChangeDetectorRef, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DesignOfficeSearch } from '../../models/design-office-search';
import { OfficeProjectCategory } from '../../models/office-project-category';
import { Pagination } from '../../models/pagination';
import { BasicDataService } from '../../services/basic-data.service';

@Component({
  selector: 'app-design-office-detail-search',
  templateUrl: './design-office-detail-search.component.html',
  styleUrls: ['./design-office-detail-search.component.css'],
  standalone: true,
  imports: [CommonModule, MatCardModule,  , MatSelectModule, MatFormFieldModule, ReactiveFormsModule],
})
export class DesignOfficeDetailSearchComponent implements OnInit, AfterViewInit {
  @Input() officeId = '';
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input()
  removedSearchField!: string;
  @Input()
  categories!: BehaviorSubject<OfficeProjectCategory[]>;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  public searchInput: FormControl = new FormControl('');
  public selectedCategories: any[] = [];
  public projectCategories!: OfficeProjectCategory[];
  public selectedoffices: any[] = [];
  public searchFields: DesignOfficeSearch = new DesignOfficeSearch({
    searchId: 1,
    categories: [],
    designers: [],
    pageQuery: new Pagination(0, 12, 0, 0),
    searchBox: ''
  });
  public showMore = false;
  public form!: FormGroup;
  public fb= inject(FormBuilder);
  public basicDataService= inject(BasicDataService);
  public route= inject(Router);
  public cdr= inject(ChangeDetectorRef);

  constructor() {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
               }

  ngOnInit() {
    this.basicDataService.getProjectCategories().subscribe((x: any) => {
      this.projectCategories = x.projectType.map((x1:any) => ({
       id: x1.idNumeric,
       categoryName: x1.displayText,
      
      } as OfficeProjectCategory));
      this.categories.next(this.projectCategories);
     })
     
    if (this.vertical) {
      this.form = this.fb.group({
        searchBox: null,
        categories: null,
        designers: null
      });
      this.showMore = true;
    }

   
  }

  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
        // this.form.controls[arr[0]]['controls'][arr[1]].reset();
      } else if (this.removedSearchField.indexOf(',') > -1) {
        const arr = this.removedSearchField.split(',');
        this.selectedCategories = this.selectedCategories.filter(x => !x.id.toString().startsWith(arr[1]));
        this.searchFields.categories = this.selectedCategories;
        this.SearchChange.emit(this.form);
        // this.form.get('categories').setValue(this.selectedCategories);
      } else {
        this.form.controls[this.removedSearchField].reset();
      }
    }
  }

  public reset() {
    this.form.reset({
      searchBox: null,
      categoriesBoxNested: null,
      brandCollectionBox: null
    });
  }

  public search() {
    this.SearchClick.emit();
  }

  public categoryChanged(event: { value: any; }) {
    if (event) {
      this.selectedCategories = [...event.value];
      this.searchFields.categories = this.selectedCategories;
      // this.store.dispatch(new SaveOfficeProjectSearchForRequest(this.searchFields));
      this.SearchChange.emit(this.form);
    }
  }

  public getAppearance() {
    return (this.variant !== 3) ? 'outline' : '';
  }
  public getFloatLabel() {
    return (this.variant === 1) ? 'always' : '';
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
    this.searchInput.valueChanges
      .pipe(
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => {
          this.SearchChange.emit(this.form);
        })
    )
    .subscribe();
  }

  public officeProjectCategoriesChanged(event: any) {
    if (event) {
      this.selectedCategories = [...event];
      this.searchFields.categories = this.selectedCategories;
      // this.store.dispatch(new SaveDesignOfficeSearchForRequest(this.searchFields));
      // this.form.get('categories').setValue(this.selectedCategories);
      this.SearchChange.emit(this.form);
    }
  }
}