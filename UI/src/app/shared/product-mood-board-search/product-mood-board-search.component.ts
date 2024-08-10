import { Component, OnInit, Input, Output, EventEmitter, OnChanges, AfterViewInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from '../../app.service';
import { Category } from 'src/app/models/category';
import { Observable } from 'rxjs';
import { Brand } from 'src/app/models/brand';
import { CategoryFlatNode } from 'src/app/pages/categories/categories.component';
import { Router, ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ProductMoodBoardSearch } from 'src/app/models/product-mood-board-search';
import { DesignMoodBoardProductSearch } from 'src/app/models/design-mood-board-product-search';

@Component({
  selector: 'app-product-mood-board-search',
  templateUrl: './product-mood-board-search.component.html',
  styleUrls: ['./product-mood-board-search.component.scss']
})
export class ProductMoodBoardSearchComponent implements OnInit, AfterViewInit {
  public color1 = '#c8c8c8';
  public selectedColor: any = {'background-color' : '#c8c8c8' };
  @Input() variant = 1;
  @Input() selectedCategories: Category[] = [];
  @Input() vertical = false;
  @Input() searchOnBtnClick = false;
  @Input() removedSearchField: string;
  @Output() SearchChange: EventEmitter<any> = new EventEmitter<any>();
  @Output() SearchClick: EventEmitter<any> = new EventEmitter<any>();
  

  public selectedFileTypes: any[] = [];
  public selectedBrands: any[] = [];
  public searchFields = new DesignMoodBoardProductSearch({
    searchId: 1,
    brandsBox: [],
    categoriesBox: [],
    colorBox: [],
    materialsBox: []
  });
  public showMore = false;
  public categories: Observable<Category[]>;
  public brands: Observable<Brand[]>;
  public propertyTypes = [];
  public showCategoriesDialog = false;
    public showProducersDialog = false;
    public showMaterialsDialog = false;
    public showColorsDialog = false;
  public allMaterials: any[] = [
     {label: 'چوب', id: 1},
    {label: 'فلز', id: 2},
    {label: 'پارچه', id: 3},
    {label: 'پلاستیک', id: 4},
    {label: 'سرامیک', id: 5},
    {label: 'چرم', id: 6},
    {label: 'استیل', id: 7},
    {label: 'بتن', id: 8}
];
public allColors: any[] = [
  {label: 'FFFFFF', value: 'FFFFFF'},
  {label: '000000', value: '000000'},
  {label: '603813', value: '603813'},
  {label: 'FF0000', value: 'FF0000'},
  {label: '2E3192', value: '2E3192'},

  {label: '006837', value: 'FFD400'},
  {label: 'F15A24', value: 'F15A24'},
  {label: 'CCCCCC', value: 'CCCCCC'},
  {label: 'DBC0B5', value: 'DBC0B5'},
  {label: 'FAB49B', value: 'FAB49B'},

  {label: '87B2C7', value: '87B2C7'},
  {label: 'ACD58A', value: 'ACD58A'},
  {label: 'FFF9AE', value: 'FFF9AE'}
];


  constructor(public appService: AppService,
              public fb: FormBuilder,
              private route: ActivatedRoute,
              private router: Router) {
                // this.router.routeReuseStrategy.shouldReuseRoute = () => false;

               }

  ngOnInit() {
    // this.brands = this.store.select(getAllBrands);
    // this.categories = this.store.select(getSecondLevelCategories);
    //   // });
    

    // this.store.pipe(select(getAllDesignMoodBoardProductSearches),
    //   map((search) => {
    //     if (search[0]) {
    //       this.searchFields = search[0];
    //     }
    //   })).subscribe();
    this.showMore = true;

  }

  ngOnChanges() {
    if (this.removedSearchField) {
      if (this.removedSearchField.indexOf('.') > -1) {
        const arr = this.removedSearchField.split('.');
      } else if (this.removedSearchField.indexOf(',') > -1) {
        const arr = this.removedSearchField.split(',');
        const removedNode = this.selectedCategories.filter(x => x.categoryId.toString() === arr[1])[0];
        this.selectedCategories = this.selectedCategories.filter(x => removedNode && x.categoryId !== +removedNode.parentCategoryId);
        this.selectedCategories = this.selectedCategories.filter(x => !x.categoryId.toString().startsWith(arr[1]));
        this.searchFields.categoriesBox = this.selectedCategories;
      //  this.store.dispatch(new SaveProductMoodBoardSearchForRequest(this.searchFields));
       // this.verticalForm.get('categoriesBox').setValue(this.selectedCategories);
        this.SearchChange.emit(this.searchFields);
      } else {
        // this.verticalForm.controls[this.removedSearchField].reset();
      }
    } else if (this.selectedCategories && this.selectedCategories.length > 0) {
      // this.verticalForm.get('categoriesBox').setValue(this.selectedCategories);
      this.SearchChange.emit(this.searchFields);
    }
  }

  public reset() {
    // this.verticalForm.reset({
    //   fileType: null,
    //   searchBox: null,
    //   categoriesBox: null,
    //   categoriesBoxNested: null,
    //   brandsBox: null
    // });
  }

  public search() {

  }



  public getAppearance() {
    return (this.variant !== 3) ? 'outline' : '';
  }
  public getFloatLabel() {
    return (this.variant === 1) ? 'always' : '';
  }
  ngAfterViewInit() {

    if (this.searchFields.categoriesBox.length > 0 && this.vertical) {
      // this.store.pipe(select(getCategoryListById(this.searchFields.categoriesBox.map(x => x.categoryId))),
      // map(cat => {
      //   if (cat && cat.length > 0 && cat[0]) {
      //     this.selectedCategories = [...cat];
      //     // this.verticalForm.get('categoriesBox').setValue(this.selectedCategories);
      //   }
      // })).subscribe();
      this.SearchChange.emit(this.searchFields);
    }
    if (this.searchFields.brandsBox.length > 0  && this.vertical) {
      // this.store.pipe(select(getBrandsListById(this.searchFields.brandsBox.map(x => x.brandId))),
      //   map(brand => {
      //     if (brand && brand.length > 0 && brand[0]) {
      //     this.selectedBrands = [...brand];
      //     // this.verticalForm.get('brandsBox').setValue(this.selectedBrands);
      //     }
      //   })).subscribe();
      this.SearchChange.emit(this.searchFields);
    }

    }


  public categoryChanged(event) {
    if (event) {
      this.searchFields.categoriesBox = [event];
      // this.brands = this.store.pipe(select(getRelatedBrandsMoodBoard(event.categoryId)));
      this.searchFields.brandsBox = [];
      this.SearchChange.emit(this.searchFields);
    } else {
      // this.brands = this.store.select(getAllBrands);
      this.searchFields.categoriesBox = [];
      this.SearchChange.emit(this.searchFields);
    }
  }
  public brandChanged(event) {
    if (event) {
      this.searchFields.brandsBox = [event];
      this.SearchChange.emit(this.searchFields);

    } else {
      this.searchFields.brandsBox = [];
      this.SearchChange.emit(this.searchFields);
    }
  }
  public materialChanged(event) {
    if (event) {
      this.searchFields.materialsBox = [event];
      this.SearchChange.emit(this.searchFields);

    } else {
      this.searchFields.materialsBox = [];
      this.SearchChange.emit(this.searchFields);
    }
  }
  public colorChanged(event) {
    if (event) {
      this.searchFields.colorsBox = [event];
      this.SearchChange.emit(this.searchFields);

    } else {
      this.searchFields.colorsBox = [];
      this.SearchChange.emit(this.searchFields);
    }
  }

  public onEventLog(event: string, data: any): void {
    this.selectedColor =  {'background-color' : data } ;
  }

}
