import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../models/category';
import { MoodBoardSearch } from '../../models/mood-board-search';
import { CategoriesComponent } from '../../pages/categories/categories.component';

@Component({
  selector: 'app-mood-boards-search',
  templateUrl: './mood-boards-search.component.html',
  styleUrls: ['./mood-boards-search.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule,MatCardModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, MatSelectModule, CategoriesComponent ]
})
export class MoodBoardsSearchComponent implements OnInit, AfterViewInit {
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input()
  removedSearchField!: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  public searchInput: FormControl = new FormControl('');
  public selectedCategories: Category[] = [];
  public searchFields: MoodBoardSearch = new MoodBoardSearch({
    searchId: 1,
    categoriesBoxNested: [],
    searchBox: ''
  });
  public showMore = false;
  public form!: FormGroup;
  public categories!: Observable<Category[]>;
  public fb= inject( FormBuilder);
  private route= inject( ActivatedRoute);
  private router= inject( Router);
  constructor() {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
               }

  ngOnInit() {
    if (this.vertical) {
      // this.route.queryParams
      // .subscribe(params => {
      //   this.searchFields.brandsBox = [];
      //   this.searchFields.fileTypes = [];
      //   this.searchFields.categoriesNestedBox = [];
      //   if (params.brands) {
      //     this.searchFields.brandsBox.push(params.brands);
      //   }
      //   if (params.categories) {
      //     this.searchFields.categoriesBoxNested.push(params.categories);
      //   }
      //   if (params.fileTypes) {
      //     this.searchFields.fileTypes.push(params.fileTypes);
      //     this.searchFields.fileTypes.forEach(x => {
      //       if (this.allFileTypes.filter(f => f.id === x)[0]) {
      //         this.selectedFileTypes.push(this.allFileTypes.filter(f => f.id === +x)[0]);
      //       }
      //     });
      //     this.form.get('fileType').setValue(this.selectedFileTypes);
      //   }
      //   if (params.filter) {
      //     this.searchFields.searchBox = params.filter;
      //   }
      // });
      // this.store.pipe(select(getAllMoodBoardSearches),
      // map((search) => {
      //   if (search[0]) {
      //     this.searchFields = search[0];
      //     this.selectedCategories = search[0].categoriesBoxNested;
      //   }
      // })).subscribe();
      this.showMore = true;
    }

    this.form = this.fb.group({
      fileType: null,
      searchBox: this.searchInput,
      categoriesBox: null,
      categoriesBoxNested: null,
      brandsBox: null
    });
  }



  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
        // this.form.controls[arr[0]]['controls'][arr[1]].reset();
      } else if (this.removedSearchField.indexOf(',') > -1) {
        const arr = this.removedSearchField.split(',');
        this.selectedCategories = this.selectedCategories.filter(x => !x.categoryId.toString().startsWith(arr[1]));
        this.searchFields.categoriesBoxNested = this.selectedCategories;
        // this.store.dispatch(new SaveMoodBoardSearchForRequest(this.searchFields));
        this.form.get('categoriesBoxNested')!.setValue(this.selectedCategories);
      } else {
        this.form.controls[this.removedSearchField].reset();
      }
    }
  }

  public reset() {
    this.form.reset({
      fileType: null,
      searchBox: null,
      categoriesBox: null,
      categoriesBoxNested: null
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
    // this.categories = this.store.select(getAllCategories);
    if (this.searchFields.categoriesBoxNested.length > 0) {
      this.SearchChange.emit(this.form);
      // this.store.pipe(select(getCategoryListById(this.searchFields.categoriesBoxNested.map(x => x.categoryId))),
      // map(cat => {
      //   if (cat && cat.length > 0 && cat[0]) {
      //     this.selectedCategories = [...cat];
      //     this.form.get('categoriesBoxNested').setValue(this.selectedCategories);
      //   }
      // })).subscribe();
    }
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

  public categoryChanged(event: any) {
    if (event) {
      this.selectedCategories = [...event];
      this.searchFields.categoriesBoxNested = this.selectedCategories;
      // this.store.dispatch(new SaveMoodBoardSearchForRequest(this.searchFields));
      this.form.get('categoriesBoxNested')!.setValue(this.selectedCategories);
      this.SearchChange.emit(this.form);
    }
  }
}
