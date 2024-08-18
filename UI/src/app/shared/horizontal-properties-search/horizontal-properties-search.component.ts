import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { AppService } from '../../app.service';
import { Category } from 'src/app/models/category';
import { forkJoin, fromEvent, Observable, of, zip } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { CategoryFlatNode } from 'src/app/pages/categories/categories.component';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Search } from 'src/app/models/search';
import { InputFile } from 'ngx-input-file';
import { BrandProductCollection } from 'src/app/models/brand-product-collection';
import { BrandCollection } from 'src/app/models/brand-collection';
import { HomeSearch } from 'src/app/models/home-search';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-horizontal-properties-search',
  templateUrl: './horizontal-properties-search.component.html',
  styleUrls: ['./horizontal-properties-search.component.scss'],
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatFormFieldModule,MatSelectModule, MatFormFieldModule, ReactiveFormsModule,  FlexLayoutModule],
})
export class HorizontalPropertiesSearchComponent implements OnInit, AfterViewInit {
  @Input() variant = 1;
  @Input() searchOnBtnClick = false;
  @Input() removedSearchField: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  public searchInput: FormControl = new FormControl('');
  public selectedCategories: any[] = [];
  public selectedFileTypes: any[] = [];
  public selectedBrands: any[] = [];
  public brandCollections: Observable<BrandCollection[]>;
  public selectedBrandCollections: any[] = [];
  public searchFields = new HomeSearch({
    searchId: 1,
    brandsBox: [],
    categoriesBoxNested: [],
    brandCollectionBox: [],
    categoriesBox: [],
    fileTypes: [],
    searchBox: '',
    imageUploaded: ''
  });
  public showMore = false;
  public form: FormGroup;
  public imageSearchForm: FormGroup;
  public categories: Observable<Category[]>;
  public brands: Observable<Brand[]>;
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


  file: any;
  url = '';
  detectFiles(event) {
   
    this.file = event.target.files[0];
    let reader = new FileReader();
    reader.onload = (e: any) => {
          this.url = e.target.result;
    };
    reader.readAsDataURL(this.file);
  }
  constructor(public appService: AppService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef,
              private router: Router) {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                
               }

  ngOnInit() {
    // this.brands = this.store.select(getAllBrands);
    // this.categories = this.store.select(getSecondLevelCategories);

    this.form = this.fb.group({
      fileType: [],
      searchBox: '',
      categoriesBox: [],
      categoriesBoxNested: [],
      brandCollectionBox: [],
      brandsBox: []
    });
    this.imageSearchForm = this.fb.group({
      categoriesBox: [],
      categoriesBoxNested: [],
      imageUploaded: ''
    });
    
  }

  public buildFeatures() {
    const arr = this.features.map(feature => {
      return this.fb.group({
        id: feature.id,
        name: feature.name,
        selected: feature.selected
      });
    });
    return this.fb.array(arr);
  }


  
  public reset() {
    this.form.reset({
      fileType: null,
      searchBox: null,
      categoriesBox: null,
      categoriesBoxNested: null,
      brandCollectionBox: null,
      brandsBox: null
    });
  }

  public search() {
    // this.store.pipe(select(getAllCategoriesFlat),    
    // tap(cats => {
    //   let children: Category[] = [];
    //   let selectedCats = this.form.get('categoriesBox').value;
    //   selectedCats.map(y => {
    //     const c = cats.filter(x => x.categoryId.toString().startsWith(y.categoryId.toString()));
    //     children = [...children, ...c];
    //   });
    //   this.searchFields.categoriesBox = children;
    //   this.searchFields.categoriesBoxNested = children;
    //   this.searchFields.searchBox = this.form.get('searchBox').value;
      
    //   this.store.dispatch(new SaveHomeSearchForRequest(this.searchFields));
    //   this.router.navigate(['/products']);
    //  // this.SearchChange.emit(this.form);
      
      
    // })).subscribe();
  }


  public getAppearance() {
    return (this.variant !== 3) ? 'outline' : '';
  }
  public getFloatLabel() {
    return (this.variant === 1) ? 'always' : '';
  }
  ngAfterViewInit() {
    
    }
  
}
