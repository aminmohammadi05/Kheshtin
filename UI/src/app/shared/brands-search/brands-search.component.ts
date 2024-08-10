import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppService } from '../../app.service'; 
import { Category } from 'src/app/models/category';
import { BehaviorSubject, Observable } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { CategoryFlatNode } from 'src/app/pages/categories/categories.component';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { BrandSearch } from 'src/app/models/brand-search';

@Component({
  selector: 'app-brands-search',
  templateUrl: './brands-search.component.html',
  styleUrls: ['./brands-search.component.css']
})
export class BrandsSearchComponent implements OnInit, AfterViewInit {
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input() removedSearchField: string;
  @Input() categories: BehaviorSubject<Category[]> = new BehaviorSubject([]);
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  public searchInput: FormControl = new FormControl('');
  public selectedCategories: any[] = [];
  public selectedFileTypes: any[] = [];
  public selectedBrands: any[] = [];
  public selectedBrandCollections: any[] = [];
  public searchFields: BrandSearch = new BrandSearch({
    searchId: 1,
    categoriesBoxNested: [],
    brandCollectionBox: [],
    searchBox: ''
  });
  public showMore = false;
  
  public verticalForm: FormGroup;

  constructor(public appService: AppService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
               }

  ngOnInit() {
    if (this.vertical) {
    
      this.verticalForm = this.fb.group({
        searchBox: this.searchInput,
        categoriesBox: [],
        categoriesBoxNested: []
      });
     
      this.showMore = true;
    } 
    
  }

  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
        this.verticalForm.controls[arr[0]]['controls'][arr[1]].reset();
      } else if (this.removedSearchField.indexOf(',') > -1) {
        const arr = this.removedSearchField.split(',');
        if (arr[0] === 'categoriesBoxNested') {
          let removedNode = this.selectedCategories.filter(x => x.categoryId.toString() === arr[1])[0];
          this.selectedCategories = this.selectedCategories.filter(x => removedNode && x.categoryId !== +removedNode.parentCategoryId);
          this.selectedCategories = this.selectedCategories.filter(x => !x.categoryId.toString().startsWith(arr[1]));
          this.searchFields.categoriesBoxNested = this.selectedCategories;
          this.searchFields.categoriesBox = this.selectedCategories;
        }
        
        // this.store.dispatch(new SaveSearchForRequest(this.searchFields));
        this.verticalForm.get('categoriesBoxNested').setValue(this.selectedCategories);        
        this.SearchChange.emit(this.verticalForm);
      } else {
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

  getCategories(event) {
    const cats: Category[] = []
    event.map(x => {
      cats.push(x);      
      x.childrenCategories.map(x1 => {
        if(x1.childrenCategories && x1.childrenCategories.length > 0) {
          cats.push(x1);
          x1.childrenCategories.map(x2 => {
            if(x2.childrenCategories && x2.childrenCategories.length > 0) {
              cats.push(x2); 
              x2.childrenCategories.map(x3 => {
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

  public categoryChanged(event) {
   
    if (event) {
      this.selectedCategories = [...event];
      this.searchFields.categoriesBoxNested = this.selectedCategories;
      // this.store.dispatch(new SaveBrandSearchForRequest(this.searchFields));
      this.verticalForm.get('categoriesBoxNested').setValue(this.selectedCategories);
      this.SearchChange.emit(this.verticalForm);
    }
  }
  
}

