import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ViewEncapsulation, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppService } from '../../app.service';
import { Category } from 'src/app/models/category';
import { BehaviorSubject, forkJoin, fromEvent, Observable, of, zip } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { CategoryFlatNode } from 'src/app/pages/categories/categories.component';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Search } from 'src/app/models/search';
import { InputFile } from 'ngx-input-file';
import { BrandProductCollection } from 'src/app/models/brand-product-collection';
import { BrandCollection } from 'src/app/models/brand-collection';
import { BasicDataService } from 'src/app/services/basic-data.service';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-properties-search',
  templateUrl: './properties-search.component.html',
  styleUrls: ['./properties-search.component.scss'],
  standalone: true,
  imports: [CommonModule, FlexLayoutModule, MatCardModule, MatButtonModule, MatIconModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule]
})
export class PropertiesSearchComponent implements OnInit, AfterViewInit {
  @Input() variant = 1;
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input() selectedBrand: any;
  
  @Input() categories: BehaviorSubject<Category[]> = new BehaviorSubject([]);
  @Input() removedSearchField: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
 
  public searchInput: FormControl = new FormControl('');
  public selectedCategories: any[] = [];
  public selectedFileTypes: any[] = [];
  public selectedBrands: any[] = [];
  public brandCollections: any[] = [];
  public selectedBrandCollections: any[] = [];
  public selectedIdList = [];
  public searchFields = new Search({
    searchId: 1,
    brandsBox: [],
    categoriesBoxNested: [],
    brandCollectionBox: [],
    categoriesBox: [],
    fileTypes: [],
    searchBox: '',
    imageUploaded: '',
    vertical: this.vertical,
  });
  public showMore = false;
  public form: FormGroup;
  public imageSearchForm: FormGroup;
  public verticalForm: FormGroup;
  //public categories: Observable<Category[]>;
  public brands: Brand[] = [];
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
  disableSelect = new FormControl(false);

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
              public basicDataService: BasicDataService, 
              private cdr: ChangeDetectorRef,
              private router: Router) {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                
               }

  ngOnInit() {
    
    if(this.selectedBrand) {
      this.disableSelect = new FormControl(true);
      this.basicDataService.getBrandCollectionByBrandId(`{from: 0, size: 500, fulltext: '${this.selectedBrand.contentItemId}'}`).subscribe(x => {
        this.brandCollections = x.getBrandCollectionByBrandId.map(x2 => ({
            title: x2.userTitle,
            brandCollectionId: x2.contentItemId
          } as BrandCollection))
      })
    }
    this.basicDataService.getBrands().subscribe(x => {
     this.brands = x.brand.map(x1 => ({
      brandId: x1.contentItemId,
      name: x1.displayText,
     
     } as Brand));
    })
 
    if (this.vertical) {
     
      this.verticalForm = this.fb.group({
        imageToSearch: '',
        fileType: [],
        searchBox: this.searchInput,
        categoriesBox: [],
        categoriesBoxNested: [],
        brandCollectionBox: [],
        brandsBox: []
      });
     
      this.showMore = true;
    } else {
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
        if (arr[0] === 'brandsBox') {
          let removedNode = this.selectedBrands.filter(x => x.brandId.toString() === arr[1])[0];
          this.selectedBrands = this.selectedBrands.filter(x => removedNode && x.brandId !== removedNode.brandId);        
          this.searchFields.brandsBox = this.selectedBrands;
        }
        if (arr[0] === 'brandCollectionBox') {
          let removedNode = this.selectedBrandCollections.filter(x => x.brandCollectionId.toString() === arr[1])[0];
          this.selectedBrandCollections = this.selectedBrandCollections.filter(x => removedNode && x.brandCollectionId !== removedNode.brandCollectionId);        
          this.searchFields.brandCollectionBox = this.selectedBrandCollections;
        }
        // this.store.dispatch(new SaveSearchForRequest(this.searchFields));
        this.verticalForm.get('categoriesBoxNested').setValue(this.selectedCategories);
        this.verticalForm.get('brandsBox').setValue(this.selectedBrands);
        this.verticalForm.get('brandCollectionBox').setValue(this.selectedBrandCollections);
        this.SearchChange.emit(this.verticalForm);
      } else {
        this.verticalForm.controls[this.removedSearchField].reset();
      }
    }
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


  public getAppearance() {
    return (this.variant !== 3) ? 'outline' : '';
  }
  public getFloatLabel() {
    return (this.variant === 1) ? 'always' : '';
  }
  ngAfterViewInit() {
    // this.store.pipe(select(getAllHomeSearches),
    // tap(s => {
    //   if (s &&
    //     s[0] &&
    //     (s[0].brandCollectionBox.length > 0 ||
    //     s[0].brandsBox.length > 0 ||
    //     s[0].categoriesBox.length > 0 ||
    //     s[0].categoriesBoxNested.length > 0 ||
    //     s[0].fileTypes.length > 0 ||
    //     s[0].searchBox.length > 0)) {
    //       this.verticalForm.get('categoriesBoxNested').setValue(s[0].categoriesBoxNested);
    //       this.verticalForm.get('searchBox').setValue(s[0].searchBox);
    //       this.verticalForm.get('brandsBox').setValue(s[0].brandsBox);
    //       this.cdr.detectChanges();
    //       this.SearchChange.emit(this.verticalForm);
    //   }
    // })).subscribe();
    if (this.searchFields.categoriesBoxNested.length > 0 && this.vertical) {
      // this.store.pipe(select(getCategoryListById(this.searchFields.categoriesBoxNested.map(x => x.categoryId))),
      // map(cat => {
      //   if (cat && cat.length > 0 && cat[0]) {
      //     this.selectedCategories = [...cat];
      //     this.verticalForm.get('categoriesBoxNested').setValue(this.selectedCategories);
      //   }
      // })).subscribe();
      this.SearchChange.emit(this.verticalForm);
    }
    if (this.searchFields.brandsBox.length > 0  && this.vertical) {
      // this.brandCollections = of([]);
      // this.store.pipe(select(getBrandsListById(this.searchFields.brandsBox.map(x => x.brandId))),
      //   map(brand => {
      //     if (brand && brand.length > 0 && brand[0]) {
      //     this.selectedBrands = [...brand];
      //     this.selectedBrands.map(b => {
      //       this.brandCollections = zip(this.brandCollections, of(b.brandCollectionList))
      //           .pipe(map(([s1, s2]) => {
      //             if (s1 && s2) {
      //               return [...s1, ...s2];
      //             } else {
      //               return [];
      //             }
      //           }));
      //       this.cdr.detectChanges();
      //     });
      //     this.verticalForm.get('brandsBox').setValue(this.selectedBrands);

      //     this.cdr.detectChanges();
      //     if (this.searchFields.brandCollectionBox.length > 0) {
      //       this.selectedBrandCollections = [...this.searchFields.brandCollectionBox];
      //       this.verticalForm.get('brandCollectionBox').setValue(this.selectedBrandCollections);
      //       this.cdr.detectChanges();
      //     } else {
      //       this.selectedBrandCollections = [];
      //     }

      //     }
      //   })).subscribe();
      this.SearchChange.emit(this.verticalForm);
    }

    if (this.searchFields.imageUploaded && this.searchFields.imageUploaded.length > 0 && this.vertical) {
        this.verticalForm.get('imageToSearch').setValue([{ id: 1,
          preview: this.searchFields.imageUploaded,
          file: new File([this.searchFields.imageUploaded], 'searchImage', {
          type: '' // dataUrl.split(';')[0].split(':')[1]
        })}]);
        this.SearchChange.emit(this.verticalForm);
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
    public searchByText(event) {
      
    }


  public categoryChanged(event) {
    this.selectedCategories = [];
    if (event) {
      this.selectedCategories = [...event];
    }
    this.searchFields.categoriesBoxNested = this.selectedCategories;
    this.SearchChange.emit(this.verticalForm);
  }

  public brandsChanged(event) {
    this.selectedBrands = [];
    this.brandCollections = [];
    if (event.value && event.value[0]) {      
      this.selectedBrands = [...event.value];
      this.basicDataService.getBrandCollectionByBrandId(`{fulltext: '${this.selectedBrands.map(x => x.brandId).join(' ')}'}`).subscribe(x => {
        this.brandCollections = x.getBrandCollectionByBrandId.map(x2 => ({
            title: x2.userTitle,
            brandCollectionId: x2.contentItemId
          } as BrandCollection))
      })
     
    }
    this.searchFields.brandsBox = this.selectedBrands;
    this.SearchChange.emit(this.verticalForm);
  }
  public brandCollectionsChanged(event) {
    this.selectedBrandCollections = [];
    if (event.value && event.value[0]) {
      this.selectedBrandCollections = [...event.value];
    }
    this.searchFields.brandCollectionBox = this.selectedBrandCollections;
    this.SearchChange.emit(this.verticalForm);
  }

  public imageSelected(image: InputFile) {
    if (image && image.file) {
      this.getBase64(image.file).then(
        data => {
          this.searchFields.imageUploaded = data.toString();
          this.verticalForm.get('imageToSearch').setValue([{ id: 1,
            preview: this.searchFields.imageUploaded,
            file: new File([this.searchFields.imageUploaded], 'searchImage', {
            type: '' // dataUrl.split(';')[0].split(':')[1]
          })}]);
          }
      );
      // this.store.dispatch(new SaveSearchForRequest(this.searchFields));
      this.SearchChange.emit(this.verticalForm);
    }
  }
  public imageDeleted(image: InputFile) {
    if (image && image.file) {
      this.searchFields.imageUploaded = '';
      // this.store.dispatch(new ResetImageIsInResultRequest());
      // this.store.dispatch(new SaveSearchForRequest(this.searchFields));
      this.SearchChange.emit(this.verticalForm);
    }
  }

  getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = error => reject(error);
    });
  }
}
