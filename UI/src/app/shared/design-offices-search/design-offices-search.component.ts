import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../../app.service';
import { Category } from 'src/app/models/category';
import { Observable } from 'rxjs';
import { DesignOffice } from 'src/app/models/design-office';
import { CategoryFlatNode } from 'src/app/pages/categories/categories.component';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { DesignOfficeSearch } from 'src/app/models/design-office-search';
import { OfficeProjectCategory } from 'src/app/models/office-project-category';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-design-offices-search',
  templateUrl: './design-offices-search.component.html',
  styleUrls: ['./design-offices-search.component.css'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatFormFieldModule, ReactiveFormsModule,  FlexLayoutModule],
})
export class DesignOfficesSearchComponent implements OnInit, AfterViewInit {
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input() removedSearchField: string;
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
  public verticalForm: FormGroup;
  public categories: Observable<OfficeProjectCategory[]>;

  constructor(public appService: AppService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
               }

  ngOnInit() {
    if (this.vertical) {
      this.route.queryParams
      .subscribe(params => {
        this.searchFields.categories = [];
        if (params.categories) {
          this.searchFields.categories.push(params.categories);
        }
        if (params.filter) {
          this.searchFields.searchBox = params.filter;
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
        this.verticalForm.controls[arr[0]]['controls'][arr[1]].reset();
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

