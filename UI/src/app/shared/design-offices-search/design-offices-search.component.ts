import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { DesignOfficeSearch } from '../../models/design-office-search';
import { OfficeProjectCategory } from '../../models/office-project-category';

@Component({
  selector: 'app-design-offices-search',
  templateUrl: './design-offices-search.component.html',
  styleUrls: ['./design-offices-search.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatFormFieldModule, ReactiveFormsModule,  ],
})
export class DesignOfficesSearchComponent implements OnInit, AfterViewInit {
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input()
  removedSearchField!: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  public searchInput: FormControl = new FormControl('');
  public selectedDesignOffices: any[] = [];
  public searchTerm = '';
  public searchFields: DesignOfficeSearch = new DesignOfficeSearch({
    searchId: 1,
    searchBox: ''
  });
  public showMore = false;
  public verticalForm!: FormGroup;
  public categories!: Observable<OfficeProjectCategory[]>;
  public fb = inject(FormBuilder);
  private route= inject(ActivatedRoute);
  private router= inject( Router);
  constructor(
              ) {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
               }

  ngOnInit() {
    if (this.vertical) {
      this.route.queryParams
      .subscribe(params => {
        this.searchFields.categories = [];
        if (params['categories']) {
          this.searchFields.categories.push(params['categories']);
        }
        if (params['filter']) {
          this.searchFields.searchBox = params['filter'];
        }
      });
      // this.store.pipe(select(getAllDesignOfficeSearches),
      // map((search) => {
      //   if (search[0]) {
      //     this.searchFields = search[0];
      //   }
      // })).subscribe();
      this.showMore = true;
    }

    this.verticalForm = this.fb.group({
      searchBox: this.searchInput,
      categories: null
    });
    // this.SearchChange.emit(this.form);
  }

  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
        // this.verticalForm.controls[arr[0]]['controls'][arr[1]].reset();
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
      searchBox: null,
      categoriesBoxNested: null,
      brandCollectionBox: null
    });
  }

  public search() {
    this.SearchClick.emit(this.verticalForm);
  }

  

  public getAppearance() {
    return (this.variant !== 3) ? 'outline' : '';
  }
  public getFloatLabel() {
    return (this.variant === 1) ? 'always' : '';
  }
  ngAfterViewInit() {
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



}

