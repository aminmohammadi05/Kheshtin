import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { BlogSearch } from '../../models/blog-search';
import { Brand } from '../../models/brand';
import { Category } from '../../models/category';
import { CategoriesComponent } from '../../pages/categories/categories.component';

@Component({
  selector: 'app-blogs-search',
  templateUrl: './blogs-search.component.html',
  styleUrls: ['./blogs-search.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatFormFieldModule, MatFormFieldModule, ReactiveFormsModule,  FlexLayoutModule, CategoriesComponent],
})
export class BlogsSearchComponent implements OnInit, AfterViewInit {
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input()
  removedSearchField!: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  @Input()
  categories!: BehaviorSubject<Category[]>;
  public searchInput: FormControl = new FormControl('');
  public selectedCategories: Category[] = [];
  public searchFields: BlogSearch = new BlogSearch({
    searchId: 1,
    categoriesBoxNested: [],
    searchBox: ''
  });
  public showMore = false;
  public verticalForm!: FormGroup;
  
  public brands!: Observable<Brand[]>;
  public propertyTypes = [];
  public allFileTypes: any[] = [
    {label: 'تصاویر', id: 1},
    {label: 'اشیا', id: 2},
    {label: 'بافت ها', id: 3},
    {label: 'کاتالوگ', id: 4},
    {label: 'اطلاعات فنی', id: 5}
];

  public cities = [];
  public neighborhoods = [];
  public streets = [];
  public features = [];
  public fb= inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  constructor(
              ) {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
               }

  ngOnInit() {
    if (this.vertical) {
      this.verticalForm = this.fb.group({
        searchBox: this.searchInput,
        categoriesBox: [],
        categoriesBoxNested: [],
      });
      this.showMore = true;
    }

    
  }

  public buildFeatures() {
    const arr = this.features.map(feature => {
      // return this.fb.group({
      //   id: feature.id,
      //   name: feature.name,
      //   selected: feature.selected
      // });
    });
    return this.fb.array(arr);
  }

  getCategories(event: any[]) {
    const cats: Category[] = []
    event.map((x: Category) => {
      cats.push(x);      
      x.childrenCategories.map((x1: Category) => {
        if(x1.childrenCategories && x1.childrenCategories.length > 0) {
          cats.push(x1);
          x1.childrenCategories.map((x2: Category) => {
            if(x2.childrenCategories && x2.childrenCategories.length > 0) {
              cats.push(x2); 
              x2.childrenCategories.map((x3: Category) => {
                cats.push(x3);
              })             
            }else{
              cats.push(x2); 
            }
          })
        }
      })
    })
    this.categories.next(cats)
  }
  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
       // this.verticalForm.controls[arr[0]]['controls'][arr[1]].reset();
      } else if (this.removedSearchField.indexOf(',') > -1) {
        const arr = this.removedSearchField.split(',');
        this.selectedCategories = this.selectedCategories.filter(x => !x.categoryId.toString().startsWith(arr[1]));
        this.searchFields.categoriesBoxNested = this.selectedCategories;
        // this.store.dispatch(new SaveBlogSearchForRequest(this.searchFields));
       // this.verticalForm.get('categoriesBoxNested').setValue(this.selectedCategories);
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
      categoriesBox: null,
      categoriesBoxNested: null,
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
    
    if (this.searchFields.categoriesBoxNested.length > 0) {
      this.SearchChange.emit(this.verticalForm);
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
          this.SearchChange.emit(this.verticalForm);
        })
    )
    .subscribe();

  }

  public categoryChanged(event: any) {
    if (event) {
      this.selectedCategories = [...event];
      this.searchFields.categoriesBoxNested = this.selectedCategories;
      // this.store.dispatch(new SaveBlogSearchForRequest(this.searchFields));
      this.verticalForm.get('categoriesBoxNested')!.setValue(this.selectedCategories);
      this.SearchChange.emit(this.verticalForm);
    }
  }
}
